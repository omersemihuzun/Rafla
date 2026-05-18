"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CreditPill } from "@/components/CreditPill";
import { FaqSection } from "@/components/FaqSection";
import { ToolShowcase } from "@/components/ToolShowcase";
import { UploadZone } from "@/components/UploadZone";

type Me = {
  bgCreditsRemaining: number;
  sceneCredits: number;
};

export default function HomePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const uploadRef = useRef<HTMLDivElement>(null);

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

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="landing-dark">
      <main className="container page-main">
        <div className="landing-hero-wrap">
          <div className="landing-float-cards" aria-hidden>
            <div className="float-card float-card-left" />
            <div className="float-card float-card-right" />
          </div>

          <section className="landing-hero">
            <h1 className="landing-serif">
              Rafla: İkinci el satıcılar için
              <br />
              AI vitrin stüdyosu
            </h1>
            <p className="hero-lead">
              Telefon fotoğrafını temiz vitrine, Dolap ve Gardrops için hazır ilan
              metnine çevirin — stüdyo yok, prompt yok, yükle ve düzenle.
            </p>
            <div className="landing-cta-row">
              <button type="button" className="btn-hero" onClick={scrollToUpload}>
                Ücretsiz dene →
              </button>
              <button
                type="button"
                className="btn-hero-ghost"
                onClick={() =>
                  document.getElementById("fayda")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Önce / sonra gör
              </button>
            </div>
            {me && (
              <div style={{ marginTop: "1rem" }}>
                <CreditPill
                  bgRemaining={me.bgCreditsRemaining}
                  sceneCredits={me.sceneCredits}
                  showRefill={process.env.NODE_ENV === "development"}
                  onRefill={() => void refill()}
                />
              </div>
            )}
            <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--muted)" }}>
              Dolap ve Gardrops satıcıları için optimize edildi.
            </p>
          </section>
        </div>

        <p className="marquee-text" aria-hidden>
          DOLAP · GARDROPS · İKİNCİ EL
        </p>

        <section ref={uploadRef} id="yukle">
          <UploadZone
            busy={busy}
            drag={drag}
            onDrag={setDrag}
            onDrop={onDrop}
            onFile={onFile}
          />
          {error && <p className="error-text">{error}</p>}
        </section>

        <section id="araclar">
          <ToolShowcase />
        </section>

        <section className="benefits-section" id="fayda">
          <h2 className="landing-serif">Daha iyi fotoğraf, daha hızlı satış</h2>
          <div className="benefits-grid">
            <div className="benefit-visual">
              <div className="benefit-half benefit-before">önce</div>
              <div className="benefit-half benefit-after">sonra</div>
            </div>
            <div className="benefit-list">
              <div>
                <h3>Tıklanma ve güven</h3>
                <p>
                  Temiz arka plan ve tutarlı vitrin, ilanını rakiplerinden ayırır;
                  alıcı gözü ile metni yayınlamadan test edersin.
                </p>
              </div>
              <div>
                <h3>AI vitrin + ilan paketi</h3>
                <p>
                  Sadece görsel değil: Gemini ile analiz, platform metni ve
                  kopyala-yapıştır export — satışa hazır paket.
                </p>
              </div>
              <div>
                <h3>Her ilanda zaman kazan</h3>
                <p>
                  Photoshop ve uzun açıklama yazma yerine dakikalar içinde stüdyo
                  akışı.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "2rem 0", textAlign: "center" }}>
          <h2 className="landing-serif" style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)" }}>
            Dolap ve Gardrops için tasarlandı
          </h2>
          <p className="hero-lead" style={{ maxWidth: 560, margin: "0.75rem auto" }}>
            Rafla genel bir fotoğraf aracı değil; ikinci el kıyafet satıcısının nasıl
            çektiğini, listelediğini ve sattığını bilen bir stüdyo.
          </p>
        </section>

        <FaqSection />

        <section className="landing-cta-bottom">
          <p className="landing-serif" style={{ fontSize: "1.25rem", color: "var(--text)" }}>
            Dolap ve Gardrops satıcıları için temiz fotoğraf ve hızlı satış.
          </p>
          <button type="button" className="btn-hero" onClick={scrollToUpload}>
            Stüdyoyu aç
          </button>
        </section>
      </main>
    </div>
  );
}
