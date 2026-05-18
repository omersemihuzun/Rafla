"use client";

import { useEffect, useState } from "react";

type Props = {
  active: boolean;
  label?: string;
  tip?: string;
};

export function ProcessingOverlay({
  active,
  label = "AI ÜRÜN GÖRSELİNİ İŞLİYOR…",
  tip = "İpucu: Dolap’ta beyaz fon ve düz ışık en yüksek tıklanmayı getirir.",
}: Props) {
  const [pct, setPct] = useState(12);

  useEffect(() => {
    if (!active) {
      setPct(12);
      return;
    }
    const t = setInterval(() => {
      setPct((p) => (p >= 92 ? 12 : p + 8 + Math.random() * 6));
    }, 400);
    return () => clearInterval(t);
  }, [active]);

  if (!active) return null;

  return (
    <div className="processing-overlay" role="status" aria-live="polite">
      <div className="processing-spinner" />
      <p className="processing-label">{label}</p>
      <div className="processing-bar-track">
        <div className="processing-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <p className="processing-pct">İşleniyor… {Math.round(pct)}%</p>
      <p className="processing-tip">{tip}</p>
    </div>
  );
}
