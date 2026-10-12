"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const RENDER_SCALE = 1.5;
const MAX_PIXEL_RATIO = 2;

async function renderPages(blob: Blob) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
  const task = pdfjs.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) });
  const scale = RENDER_SCALE * Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO);
  try {
    const pdf = await task.promise;
    const canvases: HTMLCanvasElement[] = [];
    for (let number = 1; number <= pdf.numPages; number++) {
      const page = await pdf.getPage(number);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.className = "block h-auto w-full border-t border-border first:border-t-0";
      await page.render({ canvas, viewport }).promise;
      canvases.push(canvas);
    }
    return canvases;
  } finally {
    await task.destroy();
  }
}

type PdfPagesProps = {
  blob: Blob | null;
  failed?: boolean;
  label: string;
};

export function PdfPages({ blob, failed, label }: PdfPagesProps) {
  const pagesRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState<{ blob: Blob; failed: boolean } | null>(null);

  useEffect(() => {
    if (!blob) return;
    let active = true;
    renderPages(blob)
      .then((canvases) => {
        if (!active) return;
        pagesRef.current?.replaceChildren(...canvases);
        setRendered({ blob, failed: false });
      })
      .catch(() => {
        if (active) setRendered({ blob, failed: true });
      });
    return () => {
      active = false;
    };
  }, [blob]);

  const current = rendered?.blob === blob ? rendered : null;
  const error = failed || current?.failed;

  return (
    <>
      <div ref={pagesRef} role="img" aria-label={label} hidden={!current || error} />
      {(!current || error) && (
        <div className="flex aspect-[612/792] w-full flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted">
          {error ? (
            "PDF gagal dibuat. Muat ulang halaman untuk mencoba lagi."
          ) : (
            <>
              <LoaderCircle className="size-6 animate-spin text-primary" />
              Menyiapkan PDF...
            </>
          )}
        </div>
      )}
    </>
  );
}
