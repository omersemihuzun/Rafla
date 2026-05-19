"use client";

import { useState } from "react";
import Link from "next/link";
import { RefillCreditsCard } from "@/components/RefillCreditsCard";
import { MaterialIcon } from "@/components/MaterialIcon";

const INVITE_REF = "https://rafla.app/?ref=INVITE2026";

export default function CreditsPage() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(INVITE_REF);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rafla-emerald">
      <main className="container page-main credits-page page-enter">
        <span className="credits-eyebrow-pill">LÜKS BUTİK KULÜBÜ</span>
        <h1 className="landing-serif" style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", textAlign: "center", marginBottom: "2rem" }}>
          Butik Ayrıcalıkları & Davetiyeler
        </h1>

        <RefillCreditsCard />

        <section className="card credits-invite-card">
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.05rem" }}>Davet linkin</h2>
          <div className="credits-link-row">
            <input
              className="field-input credits-link-input"
              readOnly
              value={INVITE_REF}
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
            { label: "Toplam Davet", value: "0", icon: "group" },
            { label: "Başarılı Kayıt", value: "0", icon: "check_circle" },
            { label: "Kazanılan Kredi", value: "0", icon: "card_giftcard" },
            { label: "Kalan Aylık Hak", value: "50", icon: "trending_up" },
          ].map((s) => (
            <div key={s.label} className="card credits-stat-card">
              <span className="credits-stat-icon-wrapper" aria-hidden>
                <MaterialIcon name={s.icon} size={20} />
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

