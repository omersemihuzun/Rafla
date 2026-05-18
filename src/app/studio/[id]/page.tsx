"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CreditPill } from "@/components/CreditPill";
import { ExportCard } from "@/components/ExportCard";
import { PersonaPanel } from "@/components/PersonaPanel";

type Listing = {
  id: string;
  originalImagePath: string;
  processedImagePath: string | null;
  title: string | null;
  description: string | null;
  platform: string;
  qualityScore: number | null;
  updatedAt?: string;
};

export default function StudioPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [bgCredits, setBgCredits] = useState(3);
  const [log, setLog] = useState<string[]>([]);
  const [persona, setPersona] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);

  const pushLog = (msg: string) =>
    setLog((prev) => [...prev, `${new Date().toLocaleTimeString("tr-TR")} — ${msg}`]);

  const load = useCallback(async () => {
    const [lRes, mRes] = await Promise.all([
      fetch(`/api/listings/${id}`),
      fetch("/api/me"),
    ]);
    const l = await lRes.json();
    const m = await mRes.json();
    if (lRes.ok) setListing(l.listing);
    if (mRes.ok) setBgCredits(m.bgCreditsRemaining);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const refill = async () => {
    const r = await fetch("/api/dev/refill-credits", { method: "POST" });
    const d = await r.json();
    if (r.ok) {
      setBgCredits(d.bgCreditsRemaining);
      pushLog(d.message ?? "Kredi yenilendi");
    }
  };

  const removeBg = async () => {
    setBusy(true);
    pushLog("Arka plan kaldırılıyor…");
    try {
      const res = await fetch(`/api/listings/${id}/remove-bg`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error);
      pushLog(
        data.bgMode === "fallback"
          ? "Basit iyileştirme (rembg:8000 kapalı olabilir)"
          : "Arka plan kaldırıldı"
      );
      if (data.bgCreditsRemaining !== undefined) setBgCredits(data.bgCreditsRemaining);
      await load();
    } catch (e) {
      pushLog(e instanceof Error ? e.message : "Hata");
    } finally {
      setBusy(false);
    }
  };

  const analyze = async () => {
    setBusy(true);
    pushLog("Ürün analiz ediliyor…");
    try {
      const res = await fetch(`/api/listings/${id}/analyze`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error);
      pushLog("Analiz tamamlandı");
      await load();
    } catch (e) {
      pushLog(e instanceof Error ? e.message : "Hata");
    } finally {
      setBusy(false);
    }
  };

  const generateCopy = async (platform: "dolap" | "gardrops") => {
    setBusy(true);
    pushLog(`${platform} metni yazılıyor…`);
    try {
      const res = await fetch(`/api/listings/${id}/generate-copy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error);
      pushLog(`${platform} metni hazır`);
      await load();
    } catch (e) {
      pushLog(e instanceof Error ? e.message : "Hata");
    } finally {
      setBusy(false);
    }
  };

  const personaReview = async () => {
    setBusy(true);
    pushLog("Alıcı önizlemesi…");
    try {
      const res = await fetch(`/api/listings/${id}/persona-review`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error);
      setPersona(data.review);
      pushLog("Alıcı önizlemesi tamam");
    } catch (e) {
      pushLog(e instanceof Error ? e.message : "Hata");
    } finally {
      setBusy(false);
    }
  };

  if (!listing) {
    return (
      <main className="container" style={{ padding: "3rem 0" }}>
        <p className="loading-dot">Yükleniyor…</p>
      </main>
    );
  }

  const afterSrc = listing.processedImagePath
    ? `${listing.processedImagePath}?v=${listing.updatedAt ?? listing.id}`
    : listing.originalImagePath;

  return (
    <main className="container" style={{ padding: "1.5rem 0 3rem" }}>
      <Link href="/" className="btn btn-ghost btn-sm" style={{ display: "inline-block" }}>
        ← Yeni ürün
      </Link>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          margin: "1rem 0",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.75rem" }}>Stüdyo</h1>
        <CreditPill
          bgRemaining={bgCredits}
          sceneCredits={0}
          showRefill={process.env.NODE_ENV === "development"}
          onRefill={() => void refill()}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
        }}
      >
        <figure className="card" style={{ margin: 0, padding: "0.75rem" }}>
          <figcaption style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
            Önce
          </figcaption>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listing.originalImagePath}
            alt="Orijinal"
            style={{ width: "100%", borderRadius: 8, display: "block" }}
          />
        </figure>
        <figure className="card" style={{ margin: 0, padding: "0.75rem" }}>
          <figcaption style={{ fontSize: "0.75rem", color: "var(--accent)" }}>
            Sonra
          </figcaption>
          <div
            style={{
              background: listing.processedImagePath ? "#fff" : "transparent",
              borderRadius: 8,
              padding: listing.processedImagePath ? 8 : 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={afterSrc}
              alt="İşlenmiş"
              style={{ width: "100%", display: "block", borderRadius: 4 }}
            />
          </div>
        </figure>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          margin: "1.25rem 0",
        }}
      >
        <button type="button" className="btn" disabled={busy} onClick={() => void removeBg()}>
          {busy ? "…" : "1."} Arka plan
        </button>
        <button type="button" className="btn" disabled={busy} onClick={() => void analyze()}>
          {busy ? "…" : "2."} Analiz
        </button>
        <button
          type="button"
          className="btn"
          disabled={busy}
          onClick={() => void generateCopy("dolap")}
        >
          3a. Dolap
        </button>
        <button
          type="button"
          className="btn"
          disabled={busy}
          onClick={() => void generateCopy("gardrops")}
        >
          3b. Gardrops
        </button>
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy || !listing.title}
          onClick={() => void personaReview()}
        >
          4. Alıcı gözü
        </button>
      </div>

      {listing.title && listing.description && (
        <ExportCard
          title={listing.title}
          description={listing.description}
          platform={listing.platform}
          qualityScore={listing.qualityScore}
        />
      )}

      {persona != null && <PersonaPanel review={persona} />}

      <section className="card" style={{ padding: "1rem", marginTop: "1rem" }}>
        <h2 style={{ margin: "0 0 0.75rem", fontSize: "0.9rem" }}>İşlem günlüğü</h2>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            fontSize: "0.8rem",
            color: "var(--muted)",
            maxHeight: 160,
            overflow: "auto",
          }}
        >
          {log.length === 0 && <li>Henüz işlem yok</li>}
          {log.map((line, i) => (
            <li key={i} style={{ padding: "0.2rem 0" }}>
              {line}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
