"use client";

import { useState } from "react";
import Link from "next/link";

const DEMO_REF = "https://rafla.app/?ref=DEMO2026";

export default function CreditsPage() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(DEMO_REF);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="landing-dark">
      <main className="container page-main credits-page">
        <p className="credits-eyebrow">Birlikte paylaş, birlikte kazan</p>
        <h1 className="landing-serif" style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)" }}>
          Ücretsiz kredi
        </h1>

        <section className="card credits-invite-card">
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.05rem" }}>Davet linkin</h2>
          <div className="credits-link-row">
            <input
              className="field-input credits-link-input"
              readOnly
              value={DEMO_REF}
              aria-label="Davet linki"
            />
            <button type="button" className="btn btn-primary" onClick={() => void copy()}>
              {copied ? "Kopyalandı ✓" : "Kopyala"}
            </button>
          </div>
          <p className="studio-panel-desc" style={{ marginTop: "1rem" }}>
            Paylaş:
          </p>
          <div className="credits-share-row">
            {["X", "WhatsApp", "Telegram", "Instagram"].map((s) => (
              <button key={s} type="button" className="btn btn-ghost btn-sm">
                {s}
              </button>
            ))}
          </div>
        </section>

        <div className="credits-stats">
          {[
            { label: "Toplam davet", value: "0", icon: "👥" },
            { label: "Başarılı kayıt", value: "0", icon: "✓" },
            { label: "Kazanılan kredi", value: "0", icon: "🎁" },
            { label: "Bu ay kalan hak", value: "50", icon: "📈" },
          ].map((s) => (
            <div key={s.label} className="card credits-stat-card">
              <span className="credits-stat-icon" aria-hidden>
                {s.icon}
              </span>
              <span className="credits-stat-value">{s.value}</span>
              <span className="credits-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <h2 className="section-title" style={{ fontSize: "1.25rem", marginTop: "2.5rem" }}>
          Nasıl çalışır?
        </h2>
        <div className="credits-how-grid">
          <article className="card studio-panel">
            <h3 style={{ margin: "0 0 0.5rem" }}>Kayıt ödülü</h3>
            <p className="studio-panel-desc" style={{ marginBottom: "0.75rem" }}>
              Arkadaşın linkinle kayıt olunca
            </p>
            <ul className="credits-reward-list">
              <li>
                <strong>Sen:</strong> +2 arka plan kredisi
              </li>
              <li>
                <strong>Arkadaşın:</strong> +2 arka plan kredisi
              </li>
            </ul>
          </article>
          <article className="card studio-panel">
            <h3 style={{ margin: "0 0 0.5rem" }}>Satın alma ödülü</h3>
            <p className="studio-panel-desc" style={{ marginBottom: "0.75rem" }}>
              Arkadaşın paket aldığında
            </p>
            <ul className="credits-reward-list">
              <li>
                <strong>Sen:</strong> +6 kredi
              </li>
              <li>Arkadaş başına ayda en fazla 2 kez</li>
            </ul>
          </article>
        </div>

        <p className="pricing-legend" style={{ marginTop: "1.5rem" }}>
          Sahte davetler hesabı askıya alabilir. Adil kullanım için aylık üst sınır uygulanır.{" "}
          <Link href="/pricing">Kredi paketleri →</Link>
        </p>
      </main>
    </div>
  );
}

