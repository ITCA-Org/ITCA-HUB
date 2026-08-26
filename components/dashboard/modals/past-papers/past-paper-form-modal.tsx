import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Loader, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  createPastPaper,
  PastPaper,
  PastPaperDepartment,
  PastPaperUpdateInput,
  updatePastPaper,
} from '@/hooks/past-papers/use-past-papers';
import RichTextEditor, {
  plainTextToHtml,
} from '@/components/dashboard/shared/rich-text-editor';
import { getErrorMessage } from '@/utils/error';
import { JEETIX_BASE_URL } from '@/utils/url';

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100';

type PastPaperFormModalProps = {
  isOpen: boolean;
  token: string;
  paper?: PastPaper | null;
  onClose: () => void;
  onSaved: () => void;
};

const PastPaperFormModal = ({
  isOpen,
  token,
  paper,
  onClose,
  onSaved,
}: PastPaperFormModalProps) => {
  const isEdit = Boolean(paper);
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [department, setDepartment] =
    useState<PastPaperDepartment>('computer_science');
  const [displayText, setDisplayText] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (paper) {
      setTitle(paper.title);
      setCourse(paper.course);
      setLecturer(paper.lecturer);
      setDepartment(paper.department);
      setDisplayText(plainTextToHtml(paper.displayText || ''));
      setIsPublished(paper.isPublished);
      setFileUrl(paper.fileUrl);
      setFileName(paper.fileName);
      setPdfFile(null);
    } else {
      setTitle('');
      setCourse('');
      setLecturer('');
      setDepartment('computer_science');
      setDisplayText('');
      setIsPublished(true);
      setFileUrl('');
      setFileName('');
      setPdfFile(null);
    }
  }, [isOpen, paper]);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error('PDF must be under 50MB');
      return;
    }
    setPdfFile(file);
    setFileName(file.name);
  };

  const uploadPdf = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'past-papers');
    const { data } = await axios.post(
      `${JEETIX_BASE_URL}/api/storage/upload`,
      formData
    );
    return data.data.fileUrl as string;
  };

  const handleResetDisplay = () => {
    if (paper?.extractedText) {
      setDisplayText(plainTextToHtml(paper.extractedText));
      toast.success('Display text reset from extracted PDF text');
    } else {
      toast.error('No extracted text available yet');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    if (!title.trim() || !course.trim() || !lecturer.trim()) {
      toast.error('Title, course, and lecturer are required');
      return;
    }

    setIsSaving(true);
    try {
      let finalUrl = fileUrl;
      let finalName = fileName;
      if (pdfFile) {
        finalUrl = await uploadPdf(pdfFile);
        finalName = pdfFile.name;
      }

      const payload: PastPaperUpdateInput = {
        title: title.trim(),
        course: course.trim(),
        lecturer: lecturer.trim(),
        department,
        displayText,
        isPublished,
      };

      if (finalUrl && finalName) {
        payload.fileUrl = finalUrl;
        payload.fileName = finalName;
      }

      if (isEdit && paper) {
        await updatePastPaper(paper._id, payload, token);
        toast.success('Past paper updated');
      } else {
        await createPastPaper(payload, token);
        toast.success(
          pdfFile || fileUrl
            ? 'Past paper created — text extracted from PDF'
            : 'Past paper created'
        );
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const { message } = getErrorMessage(err as Error);
      toast.error(isEdit ? 'Update failed' : 'Create failed', {
        description: message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSaving && onClose()}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {isEdit ? 'Edit past paper' : 'Add past paper'}
                </h2>
                {paper?.extractionStatus && (
                  <p className="text-xs text-gray-500">
                    Extraction: {paper.extractionStatus}
                  </p>
                )}
              </div>
              <button
                type="button"
                disabled={isSaving}
                onClick={onClose}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">
                    Title
                  </span>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputClass}
                    placeholder="e.g. CSC2101 Final Exam 2024"
                  />
                </label>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">
                      Course
                    </span>
                    <input
                      required
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className={inputClass}
                      placeholder="CSC2101"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">
                      Lecturer
                    </span>
                    <input
                      required
                      value={lecturer}
                      onChange={(e) => setLecturer(e.target.value)}
                      className={inputClass}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-gray-700">
                    Department
                  </span>
                  <select
                    value={department}
                    onChange={(e) =>
                      setDepartment(e.target.value as PastPaperDepartment)
                    }
                    className={inputClass}
                  >
                    <option value="computer_science">Computer Science</option>
                    <option value="information_systems">
                      Information Systems
                    </option>
                    <option value="telecommunications">
                      Telecommunications
                    </option>
                    <option value="all">All</option>
                  </select>
                </label>

                <div>
                  <span className="mb-2 block text-sm font-medium text-gray-700">
                    PDF file{' '}
                    <span className="font-normal text-gray-500">(optional)</span>
                  </span>
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 hover:bg-gray-100">
                    <Upload className="mb-2 h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {pdfFile?.name ||
                        fileName ||
                        'Upload past paper PDF (optional)'}
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={handlePdfChange}
                    />
                  </label>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Display text (shown to students)
                    </span>
                    {isEdit && (
                      <button
                        type="button"
                        onClick={handleResetDisplay}
                        className="text-xs font-medium text-blue-600 hover:underline"
                      >
                        Reset from extract
                      </button>
                    )}
                  </div>
                  <RichTextEditor
                    value={displayText}
                    onChange={setDisplayText}
                    placeholder="Curate the text students see. Format headings, lists, and emphasis as needed."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Full extracted text is kept for search when a PDF is uploaded.
                    You can also publish using only the display text below.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  Published (visible on public past papers page)
                </label>
              </div>

              <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={onClose}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {isSaving ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  {isEdit ? 'Save changes' : 'Create past paper'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PastPaperFormModal;
