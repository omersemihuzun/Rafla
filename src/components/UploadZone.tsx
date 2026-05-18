"use client";

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
      className={`upload-zone${drag ? " upload-zone-drag" : ""}`}
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
      <span className="upload-icon">{busy ? "⏳" : "📷"}</span>
      <span className="upload-title">
        {busy ? "Yükleniyor…" : "Ürün fotoğrafı yükle"}
      </span>
      <span className="upload-hint">
        Sürükle-bırak, galeriden seç veya kameradan çek
      </span>
      {!compact && (
        <span className="badge" style={{ marginTop: "0.25rem" }}>
          Ücretsiz başla
        </span>
      )}
    </label>
  );
}
