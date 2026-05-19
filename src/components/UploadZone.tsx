"use client";

import { MaterialIcon } from "@/components/MaterialIcon";

type Props = {
  busy: boolean;
  drag: boolean;
  onDrag: (drag: boolean) => void;
  onDrop: (e: React.DragEvent) => void;
  onFile: (file: File) => void;
  compact?: boolean;
  onTrySample?: () => void;
  sampleThumbSrc?: string;
};

export function UploadZone({
  busy,
  drag,
  onDrag,
  onDrop,
  onFile,
  compact,
  onTrySample,
  sampleThumbSrc,
}: Props) {
  return (
    <div className="upload-zone-wrap">
      <label
        className={`upload-zone page-enter page-enter-delay-2${drag ? " upload-zone-drag" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          onDrag(true);
        }}
        onDragLeave={() => onDrag(false)}
        onDrop={onDrop}
        style={compact ? { minHeight: 180 } : undefined}
      >
        <input
          type="file"
          accept="image/*"
          capture="environment"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        {!compact && (
          <span className="upload-zone-badge">
            <MaterialIcon name="bolt" size={16} />
            Ücretsiz başla
          </span>
        )}
        {sampleThumbSrc && !busy && (
          <span className="upload-sample-thumb" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={sampleThumbSrc} alt="" />
          </span>
        )}
        <span className="upload-icon-wrap">
          <MaterialIcon name={busy ? "hourglass_top" : "cloud_upload"} size={36} />
        </span>
        <span className="upload-title">
          {busy ? "Yükleniyor…" : "Ürün fotoğrafı yükle"}
        </span>
        <span className="upload-hint">
          Sürükle-bırak, galeriden seç veya kameradan çekerek anında profesyonel ilanınızı
          oluşturun.
        </span>
      </label>
      {onTrySample && !compact && (
        <button
          type="button"
          className="upload-sample-btn"
          disabled={busy}
          onClick={onTrySample}
        >
          Örnek fotoğrafla dene
        </button>
      )}
    </div>
  );
}
