"use client";

import { useEffect, useState } from "react";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  hasProcessed: boolean;
  /** Stil değişince önbellekte kalan eski görseli önlemek için */
  previewKey?: string;
  emptyHint?: string;
};

/** Sabit yan yana: sol once, sag sonra */
export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  hasProcessed,
  previewKey,
  emptyHint,
}: Props) {
  const [afterError, setAfterError] = useState(false);

  useEffect(() => {
    setAfterError(false);
  }, [afterSrc, hasProcessed, previewKey]);

  return (
    <div className="studio-preview-split">
      <figure className="studio-preview-pane studio-preview-pane--original">
        <figcaption className="studio-preview-label">Önce</figcaption>
        <div className="studio-preview-frame">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={beforeSrc} alt="Orijinal fotoğraf" />
        </div>
      </figure>

      <figure className="studio-preview-pane studio-preview-pane--result">
        <figcaption className="studio-preview-label studio-preview-label--result">
          Sonra
        </figcaption>
        <div className="studio-preview-frame">
          {hasProcessed && !afterError ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={previewKey ?? afterSrc}
              src={afterSrc}
              alt="İşlenmiş görsel"
              onError={() => setAfterError(true)}
            />
          ) : (
            <div className="studio-preview-placeholder">
              {afterError ? (
                <p>Görsel yüklenemedi. Tekrar deneyin.</p>
              ) : (
                <p>
                  {emptyHint ??
                    "Bir vitrin stili seçip görseli optimize edin."}
                </p>
              )}
            </div>
          )}
        </div>
      </figure>
    </div>
  );
}
