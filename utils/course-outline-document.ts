import type { CourseOutline } from '@/content/course-outlines';
import { totalCreditHours } from '@/content/course-outlines';

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
    margin: 0 0 6px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 9.5pt;
    color: #ff6a00;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }
  .school {
    margin: 0 0 18px;
    font-size: 10.5pt;
    color: rgba(10, 22, 40, 0.75);
  }
  .sheet h1 {
    margin: 0 0 16px;
    font-size: 20pt;
    line-height: 1.25;
    font-weight: 700;
  }
  .summary {
    margin: 0 0 24px;
    padding-bottom: 18px;
    border-bottom: 1px solid rgba(10, 22, 40, 0.15);
    font-size: 10.5pt;
    color: rgba(10, 22, 40, 0.8);
  }
  .sheet h2 {
    margin: 0 0 12px;
    font-size: 13pt;
    font-weight: 700;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5pt;
  }
  th, td {
    border: 1px solid rgba(10, 22, 40, 0.18);
    padding: 8px 10px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background: #f3f6f9;
    font-weight: 700;
  }
  td.num, th.num {
    text-align: center;
    width: 2.5rem;
  }
  td.hrs, th.hrs {
    text-align: center;
    width: 4.5rem;
  }
  tfoot td {
    font-weight: 700;
    background: #f8fafc;
  }
  .doc-footer {
    margin-top: 36px;
    padding-top: 14px;
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

function sanitizeFilename(name: string) {
  return (
    name
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 100) || 'course-outline'
  );
}

export function buildCourseOutlineDocumentHtml(outline: CourseOutline) {
  const rows = outline.courses
    .map(
      (course) => `
      <tr>
        <td class="num">${course.sn}</td>
        <td>${escapeHtml(course.code)}</td>
        <td>${escapeHtml(course.title)}</td>
        <td class="hrs">${course.creditHours}</td>
        <td>${escapeHtml(course.section)}</td>
      </tr>`
    )
    .join('');

  const listedCredits = totalCreditHours(outline);

  return `
    <article class="sheet">
      <p class="meta">${escapeHtml(outline.university)}</p>
      <p class="school">${escapeHtml(outline.school)}</p>
      <h1>${escapeHtml(outline.title)}</h1>
      <p class="summary">${escapeHtml(outline.summary)}</p>
      <h2>${escapeHtml(outline.tableHeading)}</h2>
      <table>
        <thead>
          <tr>
            <th class="num">S/N</th>
            <th>Course Code</th>
            <th>Course Title</th>
            <th class="hrs">Credit Hrs.</th>
            <th>Section</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td colspan="3">Listed core courses</td>
            <td class="hrs">${listedCredits}</td>
            <td>${outline.courses.length} courses</td>
          </tr>
        </tfoot>
      </table>
      <footer class="doc-footer">University of The Gambia, Information Technology Communication Association</footer>
    </article>
  `;
}

/** Builds a PDF from the course outline and triggers a browser download. */
export async function downloadCourseOutlineDocument(outline: CourseOutline) {
  const { downloadElementAsPdf } = await import('./download-html-pdf');
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
  host.insertAdjacentHTML('beforeend', buildCourseOutlineDocumentHtml(outline));
  document.body.appendChild(host);

  const sheet = host.querySelector('.sheet') as HTMLElement | null;
  if (!sheet) {
    host.remove();
    throw new Error('Could not prepare the document for download.');
  }

  try {
    await downloadElementAsPdf(sheet, `${sanitizeFilename(outline.title)}.pdf`);
  } finally {
    host.remove();
  }
}
