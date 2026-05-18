"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AgentLog } from "@/components/AgentLog";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { CreditPill } from "@/components/CreditPill";
import { ExportCard } from "@/components/ExportCard";
import { PersonaPanel } from "@/components/PersonaPanel";
import { ProcessingOverlay } from "@/components/ProcessingOverlay";
import {
  CLOTHING_TYPES,
  categoryToClothingId,
  type ClothingTypeId,
} from "@/lib/clothing-types";

type AgentRun = {
  agent: string;
  status: string;
  createdAt: string;
};

type Listing = {
  id: string;
  originalImagePath: string;
  processedImagePath: string | null;
  title: string | null;
  description: string | null;
  platform: string;
  qualityScore: number | null;
  metadata: string | null;
  updatedAt?: string;
  agentRuns?: AgentRun[];
};

type AnalysisMeta = {
  category?: string;
  brand?: string;
  size?: string;
  condition?: string;
  flaws?: string[];
  missingInfo?: string[];
};

export default function StudioPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [bgCredits, setBgCredits] = useState(3);
  const [platform, setPlatform] = useState<"dolap" | "gardrops">("dolap");
  const [localLog, setLocalLog] = useState<{ time: string; text: string }[]>([]);
  const [persona, setPersona] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [clothingType, setClothingType] = useState<ClothingTypeId | null>(null);
  const [extraDesc, setExtraDesc] = useState("");
  const [displayStyle, setDisplayStyle] = useState<"flat" | "white" | "mirror">("white");
  const [processingLabel, setProcessingLabel] = useState(
    "AI ÜRÜN GÖRSELİNİ İŞLİYOR…"
  );

  const pushLog = (msg: string) =>
    setLocalLog((prev) => [
      ...prev,
      {
        time: new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text: msg,
      },
    ]);

  const load = useCallback(async () => {
    const [lRes, mRes] = await Promise.all([
      fetch(`/api/listings/${id}`),
      fetch("/api/me"),
    ]);
    const l = await lRes.json();
    const m = await mRes.json();
    if (lRes.ok) {
      setListing(l.listing);
      if (l.listing.platform === "gardrops" || l.listing.platform === "dolap") {
        setPlatform(l.listing.platform);
      }
    }
    if (mRes.ok) setBgCredits(m.bgCreditsRemaining);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const analysis = useMemo((): AnalysisMeta | null => {
    if (!listing?.metadata) return null;
    try {
      return JSON.parse(listing.metadata) as AnalysisMeta;
    } catch {
      return null;
    }
  }, [listing?.metadata]);

  useEffect(() => {
    const mapped = categoryToClothingId(analysis?.category);
    if (mapped) setClothingType(mapped);
  }, [analysis?.category]);

  const refill = async () => {
    const r = await fetch("/api/dev/refill-credits", { method: "POST" });
    const d = await r.json();
    if (r.ok) {
      setBgCredits(d.bgCreditsRemaining);
      pushLog(d.message ?? "Kredi yenilendi");
    }
  };

  const removeBg = async () => {
    setProcessingLabel("AI ARKA PLANI KALDIRIYOR…");
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
    setProcessingLabel("AI ÜRÜNÜ ANALİZ EDİYOR…");
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

  const generateCopy = async (p: "dolap" | "gardrops") => {
    setProcessingLabel("AI İLAN METNİ YAZIYOR…");
    setBusy(true);
    pushLog(`${p} metni yazılıyor…`);
    try {
      const res = await fetch(`/api/listings/${id}/generate-copy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: p }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error);
      pushLog(`${p} metni hazır`);
      await load();
    } catch (e) {
      pushLog(e instanceof Error ? e.message : "Hata");
    } finally {
      setBusy(false);
    }
  };

  const personaReview = async () => {
    setProcessingLabel("AI ALICI ÖNİZLEMESİ OLUŞTURUYOR…");
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

  const runFullPackage = async () => {
    setProcessingLabel("AI TAM İLAN PAKETİNİ HAZIRLIYOR…");
    await removeBg();
    if (!listing?.metadata) await analyze();
    await generateCopy(platform);
  };

  if (!listing) {
    return (
      <div className="studio-dark">
        <main className="container studio-main">
          <p className="loading-dot">Stüdyo yükleniyor…</p>
        </main>
      </div>
    );
  }

  const afterSrc = listing.processedImagePath
    ? `${listing.processedImagePath}?v=${listing.updatedAt ?? listing.id}`
    : listing.originalImagePath;

  const hasProcessed = Boolean(listing.processedImagePath);

  return (
    <div className="studio-dark">
      <main className="container studio-main">
        <div className="studio-topbar">
        <div>
          <Link href="/" className="btn btn-ghost btn-sm">
            ← Yeni ürün
          </Link>
          <h1 className="studio-title" style={{ marginTop: "0.5rem" }}>
            Ürün stüdyosu
          </h1>
        </div>
        <CreditPill
          bgRemaining={bgCredits}
          sceneCredits={0}
          showRefill={process.env.NODE_ENV === "development"}
          onRefill={() => void refill()}
        />
      </div>

      <div className="studio-layout-v2">
        <div className="studio-preview-stage">
          <section className="card" style={{ padding: "0.85rem" }}>
            <p
              style={{
                margin: "0 0 0.65rem",
                fontSize: "0.8rem",
                color: "var(--muted)",
              }}
            >
              Doğal gün ışığında çekim en iyi sonucu verir.
            </p>
            <ProcessingOverlay active={busy} label={processingLabel} />
            <BeforeAfterSlider
              beforeSrc={listing.originalImagePath}
              afterSrc={afterSrc}
              hasProcessed={hasProcessed}
            />
          </section>
          <div className="pro-banner">
            <span>✨</span>
            <span>
              <strong>Pro (yakında):</strong> AI sahne ve manken — şu an 0 kredi
            </span>
          </div>
        </div>

        <div className="studio-sidebar">
          <section className="card studio-panel">
            <p className="studio-section-label">📸 Görsel açıklama</p>
            <p className="field-label">Kıyafet tipi *</p>
            <div className="chip-grid">
              {CLOTHING_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`chip${clothingType === t.id ? " chip-active" : ""}`}
                  disabled={busy}
                  onClick={() => setClothingType(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <input
              className="field-input"
              placeholder="Ek açıklama (isteğe bağlı)"
              value={extraDesc}
              onChange={(e) => setExtraDesc(e.target.value)}
            />
          </section>
          <section className="card studio-panel">
            <h2>📸 Görsel işleme</h2>
            <p className="studio-panel-desc">
              Arka planı kaldırın; vitrin kalitesinde beyaz veya şeffaf görsel.
            </p>
            <div className="panel-actions row">
              <button
                type="button"
                className="btn btn-primary"
                disabled={busy || bgCredits < 1}
                onClick={() => void removeBg()}
              >
                {busy ? "İşleniyor…" : "Arka planı kaldır"}
              </button>
            </div>
          </section>

          <section className="card studio-panel">
            <h2>🔍 Ürün analizi</h2>
            <p className="studio-panel-desc">
              Gemini ile kategori, beden, kusur ve eksik bilgi.
            </p>
            {analysis && (
              <div className="meta-chips">
                {analysis.category && (
                  <span className="meta-chip">Kategori: {analysis.category}</span>
                )}
                {analysis.brand && (
                  <span className="meta-chip">Marka: {analysis.brand}</span>
                )}
                {analysis.size && (
                  <span className="meta-chip">Beden: {analysis.size}</span>
                )}
                {analysis.condition && (
                  <span className="meta-chip">Durum: {analysis.condition}</span>
                )}
              </div>
            )}
            <button
              type="button"
              className="btn btn-block"
              disabled={busy}
              onClick={() => void analyze()}
            >
              {busy ? "…" : "AI ile analiz et"}
            </button>
          </section>

          <section className="card studio-panel">
            <h2>📝 İlan metni</h2>
            <p className="studio-panel-desc">
              Platform seçin; başlık ve açıklama otomatik üretilir.
            </p>
            <div
              className="panel-actions row"
              style={{ marginBottom: "0.75rem" }}
            >
              <button
                type="button"
                className={`chip${platform === "dolap" ? " chip-active" : ""}`}
                disabled={busy}
                onClick={() => setPlatform("dolap")}
              >
                Dolap
              </button>
              <button
                type="button"
                className={`chip${platform === "gardrops" ? " chip-active" : ""}`}
                disabled={busy}
                onClick={() => setPlatform("gardrops")}
              >
                Gardrops
              </button>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-block"
              disabled={busy}
              onClick={() => void generateCopy(platform)}
            >
              {platform === "gardrops" ? "Gardrops" : "Dolap"} metni üret
            </button>
            <button
              type="button"
              className="btn btn-primary btn-block"
              style={{ marginTop: "0.5rem" }}
              disabled={busy}
              onClick={() => void runFullPackage()}
            >
              Tam paket üret (Rafla)
            </button>
          </section>

          <section className="card studio-panel">
            <h2>👁️ Alıcı önizlemesi</h2>
            <p className="studio-panel-desc">
              Yayınlamadan önce alıcı perspektifiyle geri bildirim.
            </p>
            <button
              type="button"
              className="btn btn-block"
              disabled={busy || !listing.title}
              onClick={() => void personaReview()}
            >
              Alıcı gözüyle incele
            </button>
          </section>

          {listing.title && listing.description && (
            <ExportCard
              title={listing.title}
              description={listing.description}
              platform={listing.platform}
              qualityScore={listing.qualityScore}
            />
          )}

          {persona != null && <PersonaPanel review={persona} />}

          <AgentLog runs={listing.agentRuns ?? []} local={localLog} />
        </div>
      </div>

      <div className="studio-mobile-bar" role="toolbar" aria-label="Hızlı işlemler">
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy || bgCredits < 1}
          onClick={() => void removeBg()}
        >
          BG
        </button>
        <button type="button" className="btn" disabled={busy} onClick={() => void analyze()}>
          Analiz
        </button>
        <button
          type="button"
          className="btn"
          disabled={busy}
          onClick={() => void generateCopy(platform)}
        >
          Metin
        </button>
        <button
          type="button"
          className="btn"
          disabled={busy || !listing.title}
          onClick={() => void personaReview()}
        >
          Alıcı
        </button>
      </div>
      </main>
    </div>
  );
}


