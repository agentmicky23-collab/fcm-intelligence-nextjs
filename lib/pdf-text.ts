// Reads a PDF's text (with positions) in the browser with pdf.js. Nothing is uploaded.

import type { TextPage } from "@/lib/remuneration";

const WORKER = "/vendor/pdf.worker-6.4.299.min.mjs";

export async function readPdf(file: File): Promise<TextPage[]> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = WORKER;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: TextPage[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    pages.push({
      width: page.getViewport({ scale: 1 }).width,
      items: tc.items.flatMap((i) => ("str" in i ? [{ str: i.str, x: i.transform[4] as number, y: i.transform[5] as number }] : [])),
    });
  }
  await doc.cleanup();
  return pages;
}
