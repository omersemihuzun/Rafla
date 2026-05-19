"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  active: boolean;
  label?: string;
  tip?: string;
};

export function ProcessingOverlay({
  active,
  label = "AI ÜRÜN GÖRSELİNİ İŞLİYOR…",
  tip = "Temiz vitrin fotoğrafı ilanda güveni artırır.",
}: Props) {
  const [pct, setPct] = useState(0);
  const maxRef = useRef(0);

  useEffect(() => {
    if (!active) {
      maxRef.current = 0;
      setPct(0);
      return;
    }

    maxRef.current = 4;
    setPct(4);
    const start = performance.now();

    const id = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const eased = 4 + (1 - Math.exp(-elapsed / 5000)) * 92;
      const next = Math.min(97, Math.max(maxRef.current, eased));
      maxRef.current = next;
      setPct(next);
    }, 100);

    return () => window.clearInterval(id);
  }, [active]);

  if (!active) return null;

  const rounded = Math.round(pct);

  return (
    <div
      className="processing-overlay"
      role="status"
      aria-live="polite"
      aria-valuenow={rounded}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="processing-spinner" aria-hidden />
      <p className="processing-label">{label}</p>
      <div className="processing-bar-track">
        <div className="processing-bar-fill" style={{ width: `${rounded}%` }} />
      </div>
      <p className="processing-pct">İşleniyor… {rounded}%</p>
      {tip ? <p className="processing-tip">{tip}</p> : null}
    </div>
  );
}
