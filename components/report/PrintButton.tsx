"use client";

/** Scrolls through the report so every chart has drawn, then opens the print dialog. */
export function PrintButton({ className = "" }: { className?: string }) {
  async function print() {
    const start = window.scrollY;
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    await new Promise((r) => setTimeout(r, 900));
    window.scrollTo(0, start);
    window.print();
  }
  return (
    <button type="button" onClick={print} className={`no-print text-sm font-semibold ${className}`}>
      Save as PDF ↓
    </button>
  );
}
