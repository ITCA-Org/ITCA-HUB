/** Shared client-side HTML → PDF download (avoids the `html2pdf.js` package name, which webpack mis-resolves). */

type Span = { top: number; bottom: number };

/**
 * Vertical extents (in CSS px, relative to `root`) of every rendered line of text
 * and every image/table row/code line, so page breaks can be placed between them.
 */
function collectLineSpans(root: HTMLElement): Span[] {
  const origin = root.getBoundingClientRect().top;
  const spans: Span[] = [];
  const range = document.createRange();

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue;
    range.selectNodeContents(node);
    for (const rect of Array.from(range.getClientRects())) {
      if (rect.height > 0) {
        spans.push({ top: rect.top - origin, bottom: rect.bottom - origin });
      }
    }
  }

  // Elements that must never be cut through
  root.querySelectorAll('img, svg, canvas, hr, tr').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.height > 0) {
      spans.push({ top: rect.top - origin, bottom: rect.bottom - origin });
    }
  });

  return spans.sort((a, b) => a.top - b.top);
}

/**
 * Picks page break positions (CSS px) so no line straddles a break.
 * Falls back to a hard cut only when a single item is taller than a page.
 */
function collectHeadingSpans(root: HTMLElement): Span[] {
  const origin = root.getBoundingClientRect().top;
  return Array.from(root.querySelectorAll('h1, h2, h3, h4, .pp-question')).map((el) => {
    const rect = el.getBoundingClientRect();
    return { top: rect.top - origin, bottom: rect.bottom - origin };
  });
}

function computePageBreaks(
  spans: Span[],
  headings: Span[],
  totalHeight: number,
  pageHeight: number
): number[] {
  const breaks: number[] = [0];
  let start = 0;

  while (totalHeight - start > pageHeight) {
    const ideal = start + pageHeight;
    let cut = ideal;

    // Latest line top that fits on this page and isn't inside another line
    const candidates = spans
      .filter((s) => s.top > start + pageHeight * 0.3 && s.top <= ideal)
      .map((s) => s.top)
      .reverse();

    for (const y of candidates) {
      const straddles = spans.some((s) => s.top < y - 0.5 && s.bottom > y + 0.5);
      if (!straddles) {
        cut = y - 2;
        break;
      }
    }

    // Keep a heading with the text after it instead of stranding it at the page bottom
    const lastSpanAbove = spans.filter((s) => s.bottom <= cut + 2 && s.top >= start).pop();
    const orphanHeading = headings.find(
      (h) =>
        lastSpanAbove &&
        h.top <= lastSpanAbove.top + 0.5 &&
        h.bottom >= lastSpanAbove.bottom - 0.5 &&
        h.top > start + pageHeight * 0.3
    );
    if (orphanHeading) cut = orphanHeading.top - 2;

    breaks.push(cut);
    start = cut;
  }

  breaks.push(totalHeight);
  return breaks;
}

export async function downloadElementAsPdf(
  sheet: HTMLElement,
  filename: string,
  options?: {
    marginMm?: number;
    /** Adds "Page x of y" in the bottom margin. Defaults to true. */
    pageNumbers?: boolean;
  }
) {
  const margin = options?.marginMm ?? 14;
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const usableWidth = pageWidth - margin * 2;
  const usableHeight = pageHeight - margin * 2;

  const cssWidth = sheet.offsetWidth;
  const cssHeight = sheet.scrollHeight;
  const pxPerMm = cssWidth / usableWidth;
  const pageHeightPx = usableHeight * pxPerMm;

  // Measure before rasterising, while layout matches what html2canvas will draw.
  const breaks = computePageBreaks(
    collectLineSpans(sheet),
    collectHeadingSpans(sheet),
    cssHeight,
    pageHeightPx
  );

  const canvas = await html2canvas(sheet, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    scrollX: 0,
    scrollY: 0,
  });

  const canvasScale = canvas.width / cssWidth;
  const totalPages = breaks.length - 1;

  for (let i = 0; i < totalPages; i += 1) {
    const sliceTop = Math.round(breaks[i] * canvasScale);
    const sliceBottom = Math.min(canvas.height, Math.round(breaks[i + 1] * canvasScale));
    const sliceHeight = sliceBottom - sliceTop;
    if (sliceHeight <= 0) continue;

    const page = document.createElement('canvas');
    page.width = canvas.width;
    page.height = sliceHeight;
    const ctx = page.getContext('2d');
    if (!ctx) throw new Error('Could not prepare the PDF page.');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, page.width, page.height);
    ctx.drawImage(canvas, 0, sliceTop, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

    if (i > 0) pdf.addPage();
    pdf.addImage(
      page.toDataURL('image/jpeg', 0.95),
      'JPEG',
      margin,
      margin,
      usableWidth,
      sliceHeight / canvasScale / pxPerMm
    );

    if (options?.pageNumbers !== false && totalPages > 1) {
      pdf.setFontSize(8);
      pdf.setTextColor(120, 128, 140);
      pdf.text(`Page ${i + 1} of ${totalPages}`, pageWidth / 2, pageHeight - margin / 2, {
        align: 'center',
      });
    }
  }

  pdf.save(filename);
}
