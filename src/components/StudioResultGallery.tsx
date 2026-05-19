"use client";

import type { SceneGalleryItem } from "@/lib/scene-gallery";

type Props = {
  originalSrc: string;
  items: SceneGalleryItem[];
  selectedStyle: string | null;
  onSelect: (item: SceneGalleryItem) => void;
  cacheKey?: string;
};

export function StudioResultGallery({
  originalSrc,
  items,
  selectedStyle,
  onSelect,
  cacheKey = "",
}: Props) {
  const v = cacheKey ? `?v=${encodeURIComponent(cacheKey)}` : "";

  return (
    <div className="studio-gallery-wrap">
      <figure className="studio-gallery-original">
        <figcaption className="studio-preview-label">Önce</figcaption>
        <div className="studio-gallery-card studio-gallery-card--original">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${originalSrc}${v}`} alt="Orijinal fotoğraf" />
        </div>
      </figure>

      <div className="studio-gallery-results">
        <p className="studio-preview-label studio-gallery-results-title">Sonra</p>
        {items.length === 0 ? (
          <div className="studio-gallery-empty">
            <p>Vitrin paketi veya stil seçerek arka plan görselleri oluşturun.</p>
          </div>
        ) : (
          <div className="studio-gallery-scroll" role="list">
            {items.map((item) => {
              const active = selectedStyle === item.style;
              return (
                <button
                  key={item.style}
                  type="button"
                  role="listitem"
                  className={`studio-gallery-card studio-gallery-card--result${
                    active ? " studio-gallery-card--active" : ""
                  }`}
                  onClick={() => onSelect(item)}
                  title={item.label}
                >
                  <span className="studio-gallery-badge">Sonra</span>
                  <span className="studio-gallery-style">{item.label}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${item.path}${v}`}
                    alt={item.label}
                    loading="lazy"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
