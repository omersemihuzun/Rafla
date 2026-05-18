"use client";

import { useCallback, useEffect, useState } from "react";
import { CreditPill } from "@/components/CreditPill";

type Me = {
  bgCreditsRemaining: number;
  sceneCredits: number;
};

const STEPS = [
  { n: "1", t: "Arka planı temizle", d: "3 ücretsiz hak" },
  { n: "2", t: "AI ürün analizi", d: "Kategori, kusur, beden" },
  { n: "3", t: "İlan metni", d: "Dolap veya Gardrops" },
  { n: "4", t: "Alıcı gözü", d: "Önizleme ve kopyala" },
];

export default function HomePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const loadMe = () =>
    fetch("/api/me")
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setError("Oturum başlatılamadı"));

  useEffect(() => {
    void loadMe();
  }, []);

  const refill = async () => {
    const r = await fetch("/api/dev/refill-credits", { method: "POST" });
    const d = await r.json();
    if (r.ok && me) setMe({ ...me, bgCreditsRemaining: d.bgCreditsRemaining });
  };

  const onFile = useCallback(async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("platform", "dolap");
      const up = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await up.json();
      if (!up.ok) throw new Error(data.error ?? "Yükleme başarısız");
      window.location.href = `/studio/${data.listingId}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata oluştu");
    } finally {
      setBusy(false);
    }
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f?.type.startsWith("image/")) void onFile(f);
  };

  return (
    <main className="container" style={{ padding: "2rem 0 3rem" }}>
      <section style={{ maxWidth: 560, marginBottom: "2rem" }}>
        <h1
          style={{
            margin: "0 0 0.75rem",
            fontSize: "clamp(2rem, 5vw, 2.75rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
          }}
        >
          Telefon fotoğrafından
          <br />
          <span style={{ color: "var(--accent)" }}>güvenilir ilan</span>
        </h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.65, margin: "0 0 1rem" }}>
          İkinci el kıyafet satıcıları için vitrin stüdyosu. Photoshop’suz arka
          plan, Gemini ile hazır metin — Dolap ve Gardrops’a yapıştırmaya hazır.
        </p>
        {me && (
          <CreditPill
            bgRemaining={me.bgCreditsRemaining}
            sceneCredits={me.sceneCredits}
            showRefill={process.env.NODE_ENV === "development"}
            onRefill={() => void refill()}
          />
        )}
      </section>

      <label
        className="card"
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          minHeight: 240,
          padding: "2rem",
          cursor: busy ? "wait" : "pointer",
          border: drag
            ? "2px solid var(--accent)"
            : "2px dashed var(--border)",
          background: drag ? "var(--accent-soft)" : "var(--surface)",
          transition: "border 0.15s, background 0.15s",
        }}
      >
        <input
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
        />
        <span style={{ fontSize: "2rem" }}>{busy ? "⏳" : "📷"}</span>
        <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>
          {busy ? "Yükleniyor…" : "Fotoğraf seç veya sürükle"}
        </span>
        <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
          Yatak / kapı önü çekimler de olur
        </span>
      </label>

      {error && (
        <p style={{ color: "var(--danger)", marginTop: "1rem" }}>{error}</p>
      )}

      <section style={{ marginTop: "3rem" }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "1rem" }}>Nasıl çalışır?</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="card"
              style={{ padding: "1rem", background: "var(--bg-elevated)" }}
            >
              <span className="badge" style={{ marginBottom: "0.5rem" }}>
                {s.n}
              </span>
              <p style={{ margin: 0, fontWeight: 600 }}>{s.t}</p>
              <p
                style={{
                  margin: "0.25rem 0 0",
                  fontSize: "0.8rem",
                  color: "var(--muted)",
                }}
              >
                {s.d}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
