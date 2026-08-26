export type PastPaperDocumentMeta = {
  title: string;
  course: string;
  lecturer: string;
  department: string;
  displayText: string;
};

const DOCUMENT_STYLES = `
  * { box-sizing: border-box; }
  .sheet {
    width: 800px;
    max-width: 800px;
    margin: 0;
    padding: 48px 56px 56px;
    color: #0a1628;
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.55;
    background: #fff;
  }
  .meta {
    margin: 0 0 8px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 10pt;
    color: #ff6a00;
    letter-spacing: 0.02em;
  }
  .sheet h1 {
    margin: 0 0 16px;
    font-size: 22pt;
    line-height: 1.25;
    font-weight: 700;
  }
  .details {
    margin: 0 0 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(10, 22, 40, 0.15);
    font-size: 10.5pt;
    color: rgba(10, 22, 40, 0.75);
  }
  .details dt {
    font-weight: 700;
    color: #0a1628;
    display: inline;
  }
  .details dd {
    display: inline;
    margin: 0 1.25rem 0 0.35rem;
  }
  .details div { margin: 0.2rem 0; }
  .body h2 { margin: 0.9rem 0 0.45rem; font-size: 14pt; }
  .body p { margin: 0.45rem 0; }
  .body ul { margin: 0.45rem 0; padding-left: 1.25rem; list-style: disc; }
  .body ol { margin: 0.45rem 0; padding-left: 1.25rem; list-style: decimal; }
  .body code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.95em;
    background: transparent;
    padding: 0;
    border-radius: 0;
    color: #0a1628;
  }
  .body pre {
    margin: 0.75rem 0;
    padding: 0.85rem 1rem;
    background: #0f172a;
    color: #e2e8f0;
    border-radius: 0.5rem;
    overflow-x: auto;
    font-size: 10pt;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }
  .body pre code {
    background: transparent;
    padding: 0;
    color: inherit;
    font-size: inherit;
    white-space: inherit;
  }
  .body img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 0.7rem 0;
  }
  .body [style*='text-align: center'] img,
  .body [style*='text-align:center'] img {
    margin-left: auto;
    margin-right: auto;
  }
  .doc-footer {
    margin-top: 40px;
    padding-top: 16px;
    border-top: 1px solid rgba(10, 22, 40, 0.15);
    text-align: center;
    font-family: ui-sans-serif, system-ui, sans-serif;
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 0.04em;
    line-height: 1.35;
    color: #0a1628;
  }
`;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Cleans TipTap inline-code chips so adjacent fragments read as one code run,
 * and promotes code-only paragraphs to proper code blocks.
 */
export function normalizePastPaperHtml(html: string) {
  if (!html?.trim()) return html;

  let out = html;

  // Merge adjacent <code>…</code> separated only by whitespace / light punctuation
  let previous = '';
  while (out !== previous) {
    previous = out;
    out = out.replace(/<\/code>(\s*[,;:]?\s*(?:and\s+)?)<code(?:\s[^>]*)?>/gi, '$1');
  }

  // Drop space before punctuation left inside merged runs
  out = out.replace(/(<code(?:\s[^>]*)?>)([\s\S]*?)(<\/code>)/gi, (_m, open, inner, close) => {
    const cleaned = String(inner)
      .replace(/\s+([,.;:])/g, '$1')
      .replace(/\(\s+/g, '(')
      .replace(/\s+\)/g, ')');
    return `${open}${cleaned}${close}`;
  });

  // <p><code>…</code></p> with multiple lines or statements → <pre><code>
  out = out.replace(
    /<p(?:\s[^>]*)?>\s*<code(?:\s[^>]*)?>([\s\S]*?)<\/code>\s*<\/p>/gi,
    (_m, inner) => {
      const text = String(inner)
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/&nbsp;/gi, ' ');
      const looksLikeBlock =
        /\n/.test(text) ||
        /;\s*$/.test(text.trim()) ||
        text.length > 80 ||
        /[=(){}[\]]/.test(text);
      if (!looksLikeBlock) {
        return `<p><code>${inner}</code></p>`;
      }
      return `<pre><code>${text.replace(/^\n+|\n+$/g, '')}</code></pre>`;
    }
  );

  return out;
}

function sanitizeFilename(name: string) {
  return (
    name
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 100) || 'past-paper'
  );
}

export function buildPastPaperDocumentHtml(
  paper: PastPaperDocumentMeta,
  departmentLabel: string
) {
  const title = escapeHtml(paper.title);
  const body =
    normalizePastPaperHtml(paper.displayText?.trim() || '') ||
    '<p><em>No paper text available.</em></p>';

  return `
    <article class="sheet">
      <h1>${title}</h1>
      <dl class="details">
        <div><dt>Course</dt><dd>${escapeHtml(paper.course)}</dd></div>
        <div><dt>Lecturer</dt><dd>${escapeHtml(paper.lecturer)}</dd></div>
        <div><dt>Department</dt><dd>${escapeHtml(departmentLabel)}</dd></div>
      </dl>
      <div class="body">${body}</div>
      <footer class="doc-footer">University of The Gambia, Information Technology Communication Association</footer>
    </article>
  `;
}

async function waitForImages(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
}

/** Builds a PDF from the curated display text and triggers a browser download. */
export async function downloadPastPaperDocument(
  paper: PastPaperDocumentMeta,
  departmentLabel: string
) {
  const html2pdf = (await import('html2pdf.js')).default;
  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.style.position = 'fixed';
  host.style.left = '-10000px';
  host.style.top = '0';
  host.style.width = '800px';
  host.style.background = '#ffffff';
  host.style.pointerEvents = 'none';
  host.style.zIndex = '-1';

  const style = document.createElement('style');
  style.textContent = DOCUMENT_STYLES;
  host.appendChild(style);
  host.insertAdjacentHTML(
    'beforeend',
    buildPastPaperDocumentHtml(paper, departmentLabel)
  );
  document.body.appendChild(host);

  const sheet = host.querySelector('.sheet') as HTMLElement | null;
  if (!sheet) {
    host.remove();
    throw new Error('Could not prepare the document for download.');
  }

  try {
    await waitForImages(sheet);

    const filename = `${sanitizeFilename(paper.title)}.pdf`;

    await html2pdf()
      .set({
        margin: [12, 12, 14, 12] as [number, number, number, number],
        filename,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] },
      } as never)
      .from(sheet)
      .save();
  } finally {
    host.remove();
  }
}
