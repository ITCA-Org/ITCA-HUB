/**
 * Generates a Code128-style barcode as a data URL using Canvas.
 * No external library needed — draws bars from character bit patterns.
 */
export function generateBarcodeDataUrl(text: string, width = 200, height = 60): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  const chars = [...text];
  const barWidth = Math.max(1, (width - 4) / Math.max(chars.length * 6, 1));

  ctx.fillStyle = '#000000';
  let x = 2;
  chars.forEach((c) => {
    const val = c.charCodeAt(0);
    for (let b = 0; b < 5; b++) {
      if ((val >> b) & 1) {
        ctx.fillRect(x + b * barWidth * 1.2, 2, barWidth, height - 14);
      }
    }
    x += barWidth * 6.5;
  });

  // Human-readable text below
  ctx.fillStyle = '#000000';
  ctx.font = `9px monospace`;
  ctx.textAlign = 'center';
  ctx.fillText(text.slice(-12), width / 2, height - 2);

  return canvas.toDataURL('image/png');
}

export function generateBarcodeId(eventId: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const rand = Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  return `${eventId.slice(0, 8).toUpperCase()}-${rand}`;
}
