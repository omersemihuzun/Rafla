"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "monthly" | "yearly" | "packs";

const PACKS = [
  {
    badge: "İlk satış için ideal",
    badgeClass: "pricing-badge-green",
    name: "Başlangıç",
    desc: "~15 ilan paketi",
    price: "₺149",
    credits: "30 + 5 bonus kredi",
    unit: "~₺4,2 / ilan",
    featured: true,
  },
  {
    badge: "En popüler",
    badgeClass: "pricing-badge-purple",
    name: "Satıcı",
    desc: "~35 ilan paketi",
    price: "₺299",
    credits: "70 + 15 bonus kredi",
    unit: "~₺3,5 / ilan",
    featured: true,
  },
  {
    badge: null,
    badgeClass: "",
    name: "Güçlü",
    desc: "~70 ilan paketi",
    price: "₺499",
    credits: "140 + 30 bonus kredi",
    unit: "~₺2,9 / ilan",
    featured: false,
  },
  {
    badge: "En avantajlı",
    badgeClass: "pricing-badge-blue",
    name: "Pro",
    desc: "~200 ilan paketi",
    price: "₺999",
    credits: "400 + 100 bonus kredi",
    unit: "~₺2 / ilan",
    featured: false,
  },
];

export default function PricingPage() {
  const [tab, setTab] = useState<Tab>("packs");

  return (
    <div className="landing-dark">
      <main className="container page-main pricing-page">
        <div className="pricing-hero">
          <h1 className="landing-serif">Esnek kredi — ihtiyacın kadar öde</h1>
          <p className="hero-lead">
            Yan gelir ve ara sıra satanlar için. Abonelik şart değil.
          </p>
          <div className="pricing-checks">
            <span>✓ Aylık zorunluluk yok</span>
            <span>✓ Taahhüt yok</span>
            <span>✓ Krediler süresiz</span>
          </div>
        </div>

        <div className="pricing-tabs" role="tablist">
          <button
            type="button"
            className={`pricing-tab${tab === "monthly" ? " pricing-tab-active" : ""}`}
            onClick={() => setTab("monthly")}
          >
            Aylık <span className="pricing-tab-badge">-%65</span>
          </button>
          <button
            type="button"
            className={`pricing-tab${tab === "yearly" ? " pricing-tab-active" : ""}`}
            onClick={() => setTab("yearly")}
          >
            Yıllık <span className="pricing-tab-badge">-%73</span>
          </button>
          <button
            type="button"
            className={`pricing-tab${tab === "packs" ? " pricing-tab-active" : ""}`}
            onClick={() => setTab("packs")}
          >
            Kredi paketi
          </button>
        </div>

        {tab !== "packs" ? (
          <div className="card pricing-soon">
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Aylık ve yıllık planlar <strong style={{ color: "var(--text)" }}>yakında</strong>.
              Demo için <button type="button" className="link-btn" onClick={() => setTab("packs")}>kredi paketlerine</button> bakın veya ücretsiz 3 arka plan hakkıyla stüdyoyu deneyin.
            </p>
          </div>
        ) : (
          <div className="pricing-grid">
            {PACKS.map((p) => (
              <article
                key={p.name}
                className={`card pricing-card${p.featured ? " pricing-card-featured" : ""}`}
              >
                {p.badge && (
                  <span className={`pricing-badge ${p.badgeClass}`}>{p.badge}</span>
                )}
                <h2 className="pricing-card-name">{p.name}</h2>
                <p className="pricing-card-desc">{p.desc}</p>
                <p className="pricing-card-price">{p.price}</p>
                <p className="pricing-card-credits">{p.credits}</p>
                <span className="pricing-unit-pill">{p.unit}</span>
                <button
                  type="button"
                  className={p.featured ? "btn-hero btn-block" : "btn btn-block"}
                  style={{ marginTop: "1rem" }}
                >
                  Satışa bugün başla
                </button>
                <p className="pricing-card-foot">✓ Krediler süresiz</p>
              </article>
            ))}
          </div>
        )}

        <div className="card pricing-free-box">
          <strong>Ücretsiz:</strong> Herkese 3 arka plan kredisi —{" "}
          <Link href="/#yukle">demo stüdyoda dene</Link>
        </div>

        <p className="pricing-legend">
          Arka plan 1 kredi · Tam paket 1 kredi · Alıcı gözü ilk ilanlarda ücretsiz · AI sahne Pro 2 kredi (yakında)
        </p>
      </main>
    </div>
  );
}
