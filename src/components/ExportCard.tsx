"use client";

import { useState } from "react";

type Props = {
  title: string;
  description: string;
  platform: string;
  qualityScore: number | null;
};

export function ExportCard({
  title,
  description,
  platform,
  qualityScore,
}: Props) {
  const [copied, setCopied] = useState(false);
  const text = `${title}\n\n${description}`;
  const charCount = text.length;

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="card" style={{ padding: "1.25rem", marginTop: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "1.05rem" }}>İlan paketi</h2>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: "var(--muted)",
              fontSize: "0.85rem",
            }}
          >
            {platform === "gardrops" ? "Lüks Detay" : "Klasik"} formatında —
            yapıştırmaya hazır
          </p>
        </div>
        {qualityScore != null && (
          <span className="badge">Kalite {qualityScore}/100</span>
        )}
      </div>

      <p
        style={{
          margin: "0 0 0.5rem",
          fontWeight: 600,
          fontSize: "1.1rem",
          lineHeight: 1.35,
        }}
      >
        {title}
      </p>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          fontFamily: "inherit",
          margin: 0,
          padding: "1rem",
          background: "var(--bg-elevated)",
          borderRadius: "var(--radius)",
          border: "1px solid var(--border)",
          color: "var(--muted)",
          fontSize: "0.9rem",
          lineHeight: 1.6,
          maxHeight: 280,
          overflow: "auto",
        }}
      >
        {description}
      </pre>
      <p
        style={{
          margin: "0.5rem 0 0",
          fontSize: "0.75rem",
          color: "var(--muted)",
        }}
      >
        {charCount} karakter · tek tıkla panoya
      </p>

      <button
        type="button"
        className="btn btn-primary"
        style={{ width: "100%", marginTop: "1rem" }}
        onClick={() => void copy()}
      >
        {copied ? "Kopyalandı ✓" : "Tüm metni kopyala"}
      </button>
    </section>
  );
}
