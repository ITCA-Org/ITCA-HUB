import type { CourseOutline } from '@/content/course-outlines';
import {
  groupCoursesByTerm,
  outlineHasPrerequisites,
  totalCreditHours,
} from '@/content/course-outlines';

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
    margin: 1.25rem 0 0.55rem;
    font-size: 13pt;
    font-weight: 700;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9pt;
    margin-bottom: 0.75rem;
  }
  th, td {
    border: 1px solid rgba(10, 22, 40, 0.18);
    padding: 7px 8px;
    text-align: left;
    vertical-align: top;
  }
  th {
    background: #f3f6f9;
    font-weight: 700;
  }
  td.num, th.num, td.hrs, th.hrs {
    text-align: center;
  }
  tr.term td {
    background: #eef4f8;
    font-weight: 700;
    font-size: 8.5pt;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #005080;
  }
  tfoot td {
    font-weight: 700;
    background: #f8fafc;
  }
  .notes {
    margin: 1rem 0 0;
    padding-left: 1.1rem;
    font-size: 9.5pt;
    color: rgba(10, 22, 40, 0.8);
  }
  .notes li { margin: 0.35rem 0; }
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
  const showPrereq = outlineHasPrerequisites(outline);
  const termGroups = groupCoursesByTerm(outline.courses);
  const hasTerms = termGroups.some((group) => Boolean(group.term));
  const colSpan = showPrereq ? 6 : 5;

  const bodyRows = termGroups
    .map((group) => {
      const termRow =
        hasTerms && group.term
          ? `<tr class="term"><td colspan="${colSpan}">${escapeHtml(group.term)} (${group.courses.reduce(
              (sum, c) => sum + c.creditHours,
              0
            )} credits)</td></tr>`
          : '';

      const courseRows = group.courses
        .map(
          (course) => `
        <tr>
          <td class="num">${course.sn}</td>
          <td>${escapeHtml(course.code)}</td>
          <td>${escapeHtml(course.title)}</td>
          <td class="hrs">${course.creditHours}</td>
          ${showPrereq ? `<td>${escapeHtml(course.prerequisite ?? '—')}</td>` : ''}
          <td>${escapeHtml(course.section)}</td>
        </tr>`
        )
        .join('');

      return `${termRow}${courseRows}`;
    })
    .join('');

  const electivesHtml =
    outline.electives && outline.electives.length > 0
      ? `
    <h2>Elective Courses</h2>
    <table>
      <thead>
        <tr>
          <th class="num">S/N</th>
          <th>Code</th>
          <th>Course Title</th>
          <th class="hrs">Hrs</th>
        </tr>
      </thead>
      <tbody>
        ${outline.electives
          .map(
            (elective) => `
          <tr>
            <td class="num">${elective.sn}</td>
            <td>${escapeHtml(elective.code)}</td>
            <td>${escapeHtml(elective.title)}</td>
            <td class="hrs">${elective.creditHours ?? '—'}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>`
      : '';

  const notesHtml =
    outline.notes && outline.notes.length > 0
      ? `
    <h2>General Education Requirements</h2>
    <ul class="notes">
      ${outline.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}
    </ul>`
      : '';

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
            ${showPrereq ? '<th>Prerequisite</th>' : ''}
            <th>Fulfills</th>
          </tr>
        </thead>
        <tbody>${bodyRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="3">Study plan total</td>
            <td class="hrs">${totalCreditHours(outline)}</td>
            <td colspan="${showPrereq ? 2 : 1}">${outline.courses.length} courses</td>
          </tr>
        </tfoot>
      </table>
      ${electivesHtml}
      ${notesHtml}
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
