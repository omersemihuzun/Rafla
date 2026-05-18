"use client";

import { useState } from "react";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  hasProcessed: boolean;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  hasProcessed,
}: Props) {
  const [pos, setPos] = useState(50);
  const imgWidth = pos > 0 ? `${10000 / pos}%` : "100%";

  if (!hasProcessed) {
    return (
      <div className="preview-fallback">
        <figure className="card">
          <figcaption>Önce</figcaption>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={beforeSrc} alt="Orijinal" />
        </figure>
        <figure className="card">
          <figcaption style={{ color: "var(--muted)" }}>Sonra</figcaption>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={beforeSrc} alt="Önizleme" style={{ opacity: 0.45 }} />
        </figure>
      </div>
    );
  }

  return (
    <>
      <div className="compare-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beforeSrc} alt="Önce" />
        <div className="compare-after-clip" style={{ width: `${pos}%` }}>
          <div className="compare-after-bg" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={afterSrc}
            alt="Sonra"
            style={{ width: imgWidth, maxWidth: "none" }}
          />
        </div>
        <div className="compare-handle" style={{ left: `${pos}%` }} />
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          className="compare-slider"
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Önce ve sonra karşılaştır"
        />
      </div>
      <div className="compare-labels">
        <span>Önce</span>
        <span className="compare-label-after">Sonra — kaydır</span>
      </div>
    </>
  );
}
