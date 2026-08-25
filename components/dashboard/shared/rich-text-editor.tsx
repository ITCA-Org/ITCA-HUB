'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Extension } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Image } from '@tiptap/extension-image';
import { toast } from 'sonner';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Code2,
  Heading2,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Loader,
  Redo2,
  Undo2,
} from 'lucide-react';
import { JEETIX_BASE_URL } from '@/utils/url';
import { getErrorMessage } from '@/utils/error';

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

const toolbarBtn = (active: boolean) =>
  `inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition ${
    active
      ? 'bg-blue-600 text-white'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`;

/** Local TextAlign so commands register on the same @tiptap/core instance as the editor. */
const TextAlign = Extension.create({
  name: 'textAlign',
  addOptions() {
    return {
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right'],
      defaultAlignment: null as string | null,
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            parseHTML: (element) => {
              const alignment = element.style.textAlign;
              return this.options.alignments.includes(alignment)
                ? alignment
                : this.options.defaultAlignment;
            },
            renderHTML: (attributes) => {
              if (!attributes.textAlign) return {};
              return { style: `text-align: ${attributes.textAlign}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setTextAlign:
        (alignment: string) =>
        ({ commands }) => {
          if (!this.options.alignments.includes(alignment)) return false;
          return this.options.types
            .map((type: string) =>
              commands.updateAttributes(type, { textAlign: alignment })
            )
            .some(Boolean);
        },
      unsetTextAlign:
        () =>
        ({ commands }) =>
          this.options.types
            .map((type: string) => commands.resetAttributes(type, 'textAlign'))
            .some(Boolean),
    };
  },
});

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textAlign: {
      setTextAlign: (alignment: string) => ReturnType;
      unsetTextAlign: () => ReturnType;
    };
  }
}

/** Plain extracted PDF text → simple HTML paragraphs for the editor. */
export const plainTextToHtml = (text: string): string => {
  const trimmed = text.trim();
  if (!trimmed) return '';
  if (/<[a-z][\s\S]*>/i.test(trimmed)) return trimmed;
  return trimmed
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .join('<br>');
      return lines ? `<p>${lines}</p>` : '';
    })
    .filter(Boolean)
    .join('');
};

const uploadEditorImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', 'past-papers-editor');
  const { data } = await axios.post(
    `${JEETIX_BASE_URL}/api/storage/upload`,
    formData
  );
  return data.data.fileUrl as string;
};

const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Start editing…',
  className = '',
}: RichTextEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const extensions = useMemo(
    () => [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Image.configure({
        inline: false,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rich-text-image',
        },
      }),
      TextAlign,
    ],
    [placeholder]
  );

  const editor = useEditor(
    {
      extensions,
      content: value || '',
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class:
            'rich-text-content min-h-[220px] px-3 py-3 focus:outline-none text-gray-800',
        },
      },
      onUpdate: ({ editor: ed }) => {
        const html = ed.getHTML();
        onChange(html === '<p></p>' ? '' : html);
      },
    },
    [extensions]
  );

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || '';
    if (next !== current && next !== (current === '<p></p>' ? '' : current)) {
      editor.commands.setContent(next || '', { emitUpdate: false });
    }
  }, [value, editor]);

  const setAlign = (alignment: 'left' | 'center' | 'right') => {
    if (!editor) return;
    editor.chain().focus().setTextAlign(alignment).run();
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editor) return;

    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    if (!validTypes.includes(file.type)) {
      toast.error('Use JPEG, PNG, WebP, or GIF');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setIsUploadingImage(true);
    try {
      const url = await uploadEditorImage(file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (err: unknown) {
      const { message } = getErrorMessage(err as Error);
      toast.error('Image upload failed', { description: message });
    } finally {
      setIsUploadingImage(false);
    }
  };

  if (!editor) {
    return (
      <div
        className={`rounded-lg border border-gray-200 bg-gray-50 px-3 py-8 text-sm text-gray-400 ${className}`}
      >
        Loading editor…
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}
    >
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-100 bg-gray-50 px-2 py-1.5">
        <button
          type="button"
          title="Bold"
          className={toolbarBtn(editor.isActive('bold'))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Italic"
          className={toolbarBtn(editor.isActive('italic'))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Heading"
          className={toolbarBtn(editor.isActive('heading', { level: 2 }))}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Bullet list"
          className={toolbarBtn(editor.isActive('bulletList'))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Numbered list"
          className={toolbarBtn(editor.isActive('orderedList'))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Inline code"
          className={toolbarBtn(editor.isActive('code'))}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Code block"
          className={toolbarBtn(editor.isActive('codeBlock'))}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Align left"
          className={toolbarBtn(editor.isActive({ textAlign: 'left' }))}
          onClick={() => setAlign('left')}
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Align center"
          className={toolbarBtn(editor.isActive({ textAlign: 'center' }))}
          onClick={() => setAlign('center')}
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Align right"
          className={toolbarBtn(editor.isActive({ textAlign: 'right' }))}
          onClick={() => setAlign('right')}
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Insert image"
          disabled={isUploadingImage}
          className={toolbarBtn(editor.isActive('image'))}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploadingImage ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => void handleImageSelect(e)}
        />
        <span className="mx-1 h-5 w-px bg-gray-200" aria-hidden />
        <button
          type="button"
          title="Undo"
          className={toolbarBtn(false)}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          title="Redo"
          className={toolbarBtn(false)}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
