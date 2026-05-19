"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FaqSection } from "@/components/FaqSection";
import { ReviewMarquee } from "@/components/ReviewMarquee";
import { ToolShowcase } from "@/components/ToolShowcase";
import { UploadZone } from "@/components/UploadZone";
import { SAMPLE_IMAGES } from "@/lib/sample-assets";

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

  const trySamplePhoto = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(SAMPLE_IMAGES.demoGarment);
      if (!res.ok) throw new Error("Örnek görsel yüklenemedi");
      const blob = await res.blob();
      const file = new File([blob], "ornek-urun.jpg", {
        type: blob.type || "image/jpeg",
      });
      await onFile(file);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Örnek yüklenemedi");
      setBusy(false);
    }
  }, [onFile]);

  return (
    <div className="rafla-emerald">
      <main className="container page-main page-enter">
        <div className="landing-hero-wrap">
          <div className="landing-float-cards" aria-hidden>
            <div className="float-card float-card-left">
              <span className="float-card-badge badge-once">Önce</span>
              <div className="float-card-img-wrap">
                <img src="/before-1.jpeg" alt="Orijinal Çekim" className="float-card-img img-before" />
              </div>
            </div>
            <div className="float-card float-card-right">
              <span className="float-card-badge badge-sonra">Sonra</span>
              <div className="float-card-img-wrap">
                <img src="/after-1.jpeg" alt="Rafla Stüdyo Çekimi" className="float-card-img img-after" />
              </div>
            </div>
          </div>

          <section className="landing-hero">
            <p className="landing-hero-badge">
              <span className="landing-hero-badge-dot" aria-hidden />
              Seçkin İkinci El ve Butikler için Özel
            </p>
            <h1 className="landing-serif">
              Sıradan çekimlerinizi <em>premium</em> vitrin stüdyosuna dönüştürün.
            </h1>
            <p className="hero-lead">
              Yapay zeka destekli lüks stüdyomuz ile ikinci el kıyafet fotoğraflarınızı saniyeler içinde profesyonel seviyeye taşıyın; tüm lüks pazaryerleri için kusursuz ilan metninizi anında alın.
            </p>
            <div className="landing-cta-row">
              <button type="button" className="btn-hero-accent" onClick={scrollToUpload}>
                Stüdyoya Giriş Yap →
              </button>
              <button
                type="button"
                className="btn-hero-ghost"
                onClick={() =>
                  document.getElementById("fayda")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Vitrin Örnekleri
              </button>
            </div>

            <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--muted)" }}>
              Lüks ikinci el satıcıları için optimize edildi.
            </p>
          </section>
        </div>

        <div className="landing-marquee-strip" aria-hidden>
          <div className="landing-marquee-track">
            <div className="landing-marquee-content">
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>LÜKS BUTİK</span> <span className="dot">·</span>
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>PROFESYONEL VİTRİN</span> <span className="dot">·</span>
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>SEÇKİN İKİNCİ EL</span> <span className="dot">·</span>
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>PREMIUM TEKSTİL</span> <span className="dot">·</span>
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>LÜKS BUTİK</span> <span className="dot">·</span>
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>PROFESYONEL VİTRİN</span> <span className="dot">·</span>
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>SEÇKİN İKİNCİ EL</span> <span className="dot">·</span>
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>PREMIUM TEKSTİL</span> <span className="dot">·</span>
            </div>
            <div className="landing-marquee-content" aria-hidden="true">
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>LÜKS BUTİK</span> <span className="dot">·</span>
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>PROFESYONEL VİTRİN</span> <span className="dot">·</span>
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>SEÇKİN İKİNCİ EL</span> <span className="dot">·</span>
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>PREMIUM TEKSTİL</span> <span className="dot">·</span>
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>LÜKS BUTİK</span> <span className="dot">·</span>
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>PROFESYONEL VİTRİN</span> <span className="dot">·</span>
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>SEÇKİN İKİNCİ EL</span> <span className="dot">·</span>
              <span className="brand">RAFLA</span> <span className="dot">·</span>
              <span>PREMIUM TEKSTİL</span> <span className="dot">·</span>
            </div>
          </div>
        </div>

        <section ref={uploadRef} id="yukle">
          <UploadZone
            busy={busy}
            drag={drag}
            onDrag={setDrag}
            onDrop={onDrop}
            onFile={onFile}
            onTrySample={() => void trySamplePhoto()}
            sampleThumbSrc={SAMPLE_IMAGES.uploadThumb}
          />
          {error && <p className="error-text">{error}</p>}
        </section>

        <ToolShowcase />

        <section className="benefits-section" id="fayda">
          <h2 className="landing-serif">Kusursuz vitrin, prestijli satış</h2>
          <div className="benefits-grid">
            <div className="benefit-visual">
              <div className="benefit-half benefit-before">
                <img src="/before.jpeg" alt="Önce" className="benefit-img" />
                <span className="benefit-label">önce</span>
              </div>
              <div className="benefit-half benefit-after">
                <img src="/after.jpeg" alt="Sonra" className="benefit-img" />
                <span className="benefit-label benefit-label-after">sonra</span>
              </div>
            </div>
            <div className="benefit-list">
              <div>
                <h3>Marka İmajı ve Güven</h3>
                <p>
                  Lüks butik görünümü veren temiz arka plan ve tutarlı vitrin ile ilanınızı rakiplerinizden ayırın;
                  alıcı gözü ile metni yayınlamadan önce test edin.
                </p>
              </div>
              <div>
                <h3>Premium Vitrin & İlan Paketi</h3>
                <p>
                  Sadece bir fotoğraf düzenleyici değil: Gemini ile derin analiz, butik düzeyinde platform metni ve
                  kopyala-yapıştır akıcılığı — satışa hazır prestijli paket.
                </p>
              </div>
              <div>
                <h3>Zamanın Size Kalsın</h3>
                <p>
                  Photoshop ile uğraşmak ve uzun açıklamalar yazmak yerine dakikalar içinde profesyonel stüdyo
                  akışını deneyimleyin.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "2rem 0", textAlign: "center" }}>
          <h2 className="landing-serif" style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)" }}>
            İkinci El Modanın Yeni Zirvesi
          </h2>
          <p className="hero-lead" style={{ maxWidth: 560, margin: "0.75rem auto" }}>
            Rafla, sıradan bir düzenleyici değil; lüks ikinci el modanın ruhunu anlayan ve satıcısını zirveye taşıyan özel bir dijital stüdyodur.
          </p>
        </section>

        <ReviewMarquee />


        <FaqSection />
      </main>
    </div>
  );
}
