"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const [afterError, setAfterError] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [wrapWidth, setWrapWidth] = useState(0);

  const measure = useCallback(() => {
    const w = wrapRef.current?.offsetWidth ?? 0;
    if (w > 0) setWrapWidth(w);
  }, []);

  useEffect(() => {
    measure();
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, hasProcessed]);

  useEffect(() => {
    setAfterError(false);
  }, [afterSrc]);

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
      <div className="compare-wrap" ref={wrapRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beforeSrc} alt="Önce" className="compare-img-base" />
        <div className="compare-after-clip" style={{ width: `${pos}%` }}>
          <div className="compare-after-bg" />
          {afterError ? (
            <p className="compare-after-error">
              Sonuç görseli yüklenemedi. Tekrar optimize etmeyi deneyin.
            </p>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={afterSrc}
              alt="Sonra"
              className="compare-img-after"
              style={wrapWidth > 0 ? { width: wrapWidth } : undefined}
              onLoad={measure}
              onError={() => setAfterError(true)}
            />
          )}
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
