"use client";

import { MaterialIcon } from "@/components/MaterialIcon";

type Props = {
  busy: boolean;
  drag: boolean;
  onDrag: (drag: boolean) => void;
  onDrop: (e: React.DragEvent) => void;
  onFile: (file: File) => void;
  compact?: boolean;
};

export function UploadZone({
  busy,
  drag,
  onDrag,
  onDrop,
  onFile,
  compact,
}: Props) {
  return (
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
      <span className="upload-icon-wrap">
        <MaterialIcon name={busy ? "hourglass_top" : "camera_enhance"} size={40} />
      </span>
      <span className="upload-title">
        {busy ? "Yükleniyor…" : "Ürün fotoğrafı yükle"}
      </span>
      <span className="upload-hint">
        Sürükle-bırak, galeriden seç veya kameradan çekerek anında profesyonel ilanınızı
        oluşturun.
      </span>
    </label>
  );
}
