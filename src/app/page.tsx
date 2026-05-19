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
    <div className="rafla-light">
      <main className="container page-main page-enter">
        <div className="landing-hero-wrap">
          <div className="landing-float-cards" aria-hidden>
            <div className="float-card float-card-left" />
            <div className="float-card float-card-right" />
          </div>

          <section className="landing-hero">
            <p className="landing-hero-badge">
              <span className="landing-hero-badge-dot" aria-hidden />
              Dolap &amp; Gardrops satıcıları için özel
            </p>
            <h1 className="landing-serif">
              Sıradan çekimleri <em>Profesyonel</em> katalog görsellerine dönüştürün.
            </h1>
            <p className="hero-lead">
              Yapay zeka destekli stüdyomuz ile kıyafet fotoğraflarınızın arka planını
              saniyeler içinde değiştirin; Dolap ve Gardrops için hazır ilan metnini alın.
            </p>
            <div className="landing-cta-row">
              <button type="button" className="btn-hero-accent" onClick={scrollToUpload}>
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

        <div className="landing-marquee-strip" aria-hidden>
          <span>Dolap · Gardrops · İkinci El</span>
          <span className="landing-marquee-repeat">· Dolap · Gardrops · İkinci El</span>
        </div>

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

        <ToolShowcase />

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
          <button type="button" className="btn-hero-accent" onClick={scrollToUpload}>
            Stüdyoyu aç
          </button>
        </section>
      </main>
    </div>
  );
}
