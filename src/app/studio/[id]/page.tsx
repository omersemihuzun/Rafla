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
  clothingTypeLabel,
  type ClothingTypeId,
} from "@/lib/clothing-types";
import { MaterialIcon } from "@/components/MaterialIcon";
import { friendlyApiError } from "@/lib/errors";
import { scenePathFromListing } from "@/lib/listing-meta";

type AgentRun = {
  agent: string;
  status: string;
  createdAt: string;
};

type Listing = {
  id: string;
  originalImagePath: string;
  processedImagePath: string | null;
  sceneImagePath?: string | null;
  sceneStyle?: string | null;
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

function parseAnalysisMeta(metadata: string | null): AnalysisMeta | null {
  if (!metadata) return null;
  try {
    const raw = JSON.parse(metadata) as Record<string, unknown>;
    return {
      category: raw.category != null ? String(raw.category) : undefined,
      brand:
        raw.brandGuess != null
          ? String(raw.brandGuess)
          : raw.brand != null
            ? String(raw.brand)
            : undefined,
      size:
        raw.sizeGuess != null
          ? String(raw.sizeGuess)
          : raw.size != null
            ? String(raw.size)
            : undefined,
      condition: raw.condition != null ? String(raw.condition) : undefined,
      flaws: Array.isArray(raw.visibleFlaws)
        ? (raw.visibleFlaws as string[])
        : Array.isArray(raw.flaws)
          ? (raw.flaws as string[])
          : undefined,
      missingInfo: Array.isArray(raw.missingForTrust)
        ? (raw.missingForTrust as string[])
        : Array.isArray(raw.missingInfo)
          ? (raw.missingInfo as string[])
          : undefined,
    };
  } catch {
    return null;
  }
}

export default function StudioPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [bgCredits, setBgCredits] = useState(3);
  const [sceneCredits, setSceneCredits] = useState(2);
  const [platform, setPlatform] = useState<"dolap" | "gardrops">("dolap");
  const [localLog, setLocalLog] = useState<{ time: string; text: string }[]>([]);
  const [persona, setPersona] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  const [clothingType, setClothingType] = useState<ClothingTypeId | null>(null);
  const [extraDesc, setExtraDesc] = useState("");
  const [displayStyle, setDisplayStyle] = useState<
    "flat" | "white" | "mirror" | "model"
  >("white");
  const [processingLabel, setProcessingLabel] = useState(
    "AI ÜRÜN GÖRSELİNİ İŞLİYOR…"
  );
  const [rembgOnline, setRembgOnline] = useState<boolean | null>(null);
  const [studioError, setStudioError] = useState<string | null>(null);

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
    if (mRes.ok) {
      setBgCredits(m.bgCreditsRemaining);
      if (typeof m.sceneCredits === "number") setSceneCredits(m.sceneCredits);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    fetch("/api/health/rembg")
      .then((r) => r.json())
      .then((d: { ok?: boolean }) => setRembgOnline(Boolean(d.ok)))
      .catch(() => setRembgOnline(false));
  }, []);

  const analysis = useMemo(
    () => parseAnalysisMeta(listing?.metadata ?? null),
    [listing?.metadata]
  );

  const analyzeHints = () => ({
    clothingType: clothingTypeLabel(clothingType),
    extraDescription: extraDesc.trim() || undefined,
  });

  useEffect(() => {
    const mapped = categoryToClothingId(analysis?.category);
    if (mapped) setClothingType(mapped);
  }, [analysis?.category]);

  const refill = async () => {
    const r = await fetch("/api/dev/refill-credits", { method: "POST" });
    const d = await r.json();
    if (r.ok) {
      setBgCredits(d.bgCreditsRemaining);
      if (typeof d.sceneCredits === "number") setSceneCredits(d.sceneCredits);
      pushLog(d.message ?? "Kredi yenilendi");
    }
  };

  const sceneCost =
    displayStyle === "mirror" ? 2 : 1;

  useEffect(() => {
    if (displayStyle === "mirror" && sceneCredits < 2) {
      setDisplayStyle("white");
    }
    if (displayStyle === "model" && sceneCredits < 1) {
      setDisplayStyle("white");
    }
  }, [sceneCredits, displayStyle]);

  const generateScene = async () => {
    if (displayStyle === "model" && !clothingType) {
      setStudioError("Manken için önce kıyafet tipini seçin (ör. Üst).");
      pushLog("Kıyafet tipi gerekli");
      return;
    }
    if (sceneCredits < sceneCost) {
      pushLog(`Sahne için ${sceneCost} kredi gerekir`);
      setStudioError(
        displayStyle === "model"
          ? "Sahne kredin bitti. /credits sayfasından demo kredi yenileyebilirsin."
          : `Bu stil için ${sceneCost} sahne kredisi gerekir.`
      );
      return;
    }
    setProcessingLabel(
      displayStyle === "model"
        ? "AI MANKEN ÜZERİNDE OLUŞTURUYOR…"
        : "AI VİTRİN SAHNESİ OLUŞTURUYOR…"
    );
    setBusy(true);
    setStudioError(null);
    pushLog(`Sahne üretiliyor (${displayStyle})…`);
    try {
      const res = await fetch(`/api/listings/${id}/generate-scene`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: displayStyle,
          clothingType: clothingTypeLabel(clothingType),
          extraDescription: extraDesc.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error ?? "Sahne üretilemedi");
      if (typeof data.sceneCredits === "number") setSceneCredits(data.sceneCredits);
      if (displayStyle === "model") {
        pushLog(
          data.mode === "gemini"
            ? "Manken görseli (AI) hazır ✓"
            : "Manken görseli (stüdyo düzeni) hazır — AI kapalıysa basit vitrin kullanıldı ✓"
        );
      } else {
        pushLog("Görsel optimize edildi ✓");
      }
      setStudioError(null);
      await load();
    } catch (e) {
      const msg = friendlyApiError(
        e instanceof Error ? e.message : "Sahne üretilemedi"
      );
      setStudioError(msg);
      pushLog(msg);
    } finally {
      setBusy(false);
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
    setStudioError(null);
    pushLog("Ürün analiz ediliyor…");
    try {
      const res = await fetch(`/api/listings/${id}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(analyzeHints()),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? data.error);
      pushLog("Analiz tamamlandı");
      await load();
    } catch (e) {
      const msg = friendlyApiError(e instanceof Error ? e.message : "Hata");
      setStudioError(msg);
      pushLog(msg);
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
    setBusy(true);
    setStudioError(null);
    pushLog("Tam paket başladı");
    try {
      const needsBg = bgCredits > 0 && !listing?.processedImagePath;
      if (needsBg) {
        setProcessingLabel("AI ARKA PLANI KALDIRIYOR…");
        const bgRes = await fetch(`/api/listings/${id}/remove-bg`, { method: "POST" });
        const bgData = await bgRes.json();
        if (!bgRes.ok) throw new Error(bgData.message ?? bgData.error);
        if (bgData.bgCreditsRemaining !== undefined) setBgCredits(bgData.bgCreditsRemaining);
        pushLog(
          bgData.bgMode === "fallback"
            ? "Arka plan (basit mod)"
            : "Arka plan kaldırıldı"
        );
        await load();
      }

      setProcessingLabel("AI ÜRÜNÜ ANALİZ EDİYOR…");
      const checkRes = await fetch(`/api/listings/${id}`);
      const checkData = await checkRes.json();
      if (!checkRes.ok) throw new Error("İlan yüklenemedi");
      if (!checkData.listing?.metadata) {
        const aRes = await fetch(`/api/listings/${id}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(analyzeHints()),
        });
        const aData = await aRes.json();
        if (!aRes.ok) throw new Error(aData.message ?? aData.error);
        pushLog("Analiz tamamlandı");
        await load();
      }

      setProcessingLabel("AI İLAN METNİ YAZIYOR…");
      const cRes = await fetch(`/api/listings/${id}/generate-copy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      const cData = await cRes.json();
      if (!cRes.ok) throw new Error(cData.message ?? cData.error);
      pushLog(`${platform} metni hazır`);
      await load();

      if (sceneCredits >= sceneCost) {
        setProcessingLabel("AI VİTRİN SAHNESİ OLUŞTURUYOR…");
        const sRes = await fetch(`/api/listings/${id}/generate-scene`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
          style: displayStyle,
          clothingType: clothingTypeLabel(clothingType),
          extraDescription: extraDesc.trim() || undefined,
        }),
        });
        const sData = await sRes.json();
        if (sRes.ok) {
          if (typeof sData.sceneCredits === "number") setSceneCredits(sData.sceneCredits);
          pushLog("Vitrin sahnesi hazır");
          await load();
        } else {
          pushLog(sData.message ?? "Sahne atlandı");
        }
      }

      setProcessingLabel("AI ALICI ÖNİZLEMESİ OLUŞTURUYOR…");
      const pRes = await fetch(`/api/listings/${id}/persona-review`, {
        method: "POST",
      });
      const pData = await pRes.json();
      if (pRes.ok) {
        setPersona(pData.review);
        pushLog("Alıcı önizlemesi tamam");
      }

      pushLog("Tam paket hazır ✓");
    } catch (e) {
      const msg = friendlyApiError(
        e instanceof Error ? e.message : "Tam paket başarısız"
      );
      setStudioError(msg);
      pushLog(msg);
    } finally {
      setBusy(false);
    }
  };

  if (!listing) {
    return (
      <div className="rafla-light studio-page">
        <main className="container studio-main">
          <p className="loading-dot">Stüdyo yükleniyor…</p>
        </main>
      </div>
    );
  }

  const displayPath = scenePathFromListing(listing);
  const afterSrc = displayPath
    ? `${displayPath}?v=${listing.updatedAt ?? listing.id}`
    : listing.originalImagePath;

  const hasProcessed = Boolean(displayPath);

  return (
    <div className="rafla-light studio-page">
      <main className="studio-shell page-enter">
        <div className="studio-topbar">
        <div className="studio-topbar-left">
          <Link href="/" className="studio-back-link">
            <MaterialIcon name="arrow_back" size={18} />
            Yeni ürün
          </Link>
          <h1 className="studio-title">Ürün stüdyosu</h1>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
          <CreditPill
            bgRemaining={bgCredits}
            sceneCredits={sceneCredits}
            showRefill={process.env.NODE_ENV === "development"}
            onRefill={() => void refill()}
          />
          {process.env.NODE_ENV === "development" && (bgCredits < 1 || sceneCredits < 1) && (
            <Link href="/credits" className="rafla-btn rafla-btn-secondary btn-sm">
              Kredi yenile
            </Link>
          )}
        </div>
      </div>

      {studioError && (
        <div className="studio-alert studio-alert-error" role="alert">
          <MaterialIcon name="error" size={20} />
          <span>{studioError}</span>
        </div>
      )}
      {rembgOnline === false && (
        <div className="studio-alert studio-alert-warn">
          <MaterialIcon name="warning" size={20} />
          <span>
            <strong>rembg kapalı:</strong> Basit beyaz fon kullanılıyor.{" "}
            <code style={{ fontSize: "0.72rem" }}>uvicorn main:app --port 8000</code>
          </span>
        </div>
      )}

      <div className="studio-layout-v2">
        <div className="studio-preview-stage">
          <section className="card studio-preview-card">
            <p className="studio-preview-hint">
              Doğal gün ışığında çekim en iyi sonucu verir.
            </p>
            <ProcessingOverlay active={busy} label={processingLabel} />
            <BeforeAfterSlider
              beforeSrc={listing.originalImagePath}
              afterSrc={afterSrc}
              hasProcessed={hasProcessed}
            />
            {hasProcessed && (
              <a
                href={afterSrc}
                download={`rafla-${listing.id}.png`}
                className="btn btn-sm btn-block"
                style={{ marginTop: "0.75rem" }}
              >
                Görseli indir
              </a>
            )}
          </section>
        </div>

        <div className="studio-sidebar">
          <section className="card studio-panel">
            <p className="studio-section-label">Görsel açıklama</p>
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
            <p className="studio-section-label style">Üretim stili</p>
            <div className="chip-grid" style={{ marginBottom: "0.75rem" }}>
              <button
                type="button"
                className={`chip${displayStyle === "white" ? " chip-active" : ""}`}
                disabled={busy}
                onClick={() => setDisplayStyle("white")}
              >
                Beyaz vitrin
              </button>
              <button
                type="button"
                className={`chip${displayStyle === "flat" ? " chip-active" : ""}`}
                disabled={busy}
                onClick={() => setDisplayStyle("flat")}
              >
                Düz sergi
              </button>
              <button
                type="button"
                className={`chip${displayStyle === "mirror" ? " chip-active" : ""}${
                  sceneCredits < 2 ? " chip-pro-locked" : ""
                }`}
                disabled={busy || sceneCredits < 2}
                onClick={() => setDisplayStyle("mirror")}
              >
                {sceneCredits < 2 ? "🔒 " : ""}
                Ayna selfie
              </button>
              <button
                type="button"
                className={`chip${displayStyle === "model" ? " chip-active" : ""}${
                  sceneCredits < 1 ? " chip-pro-locked" : ""
                }`}
                disabled={busy || sceneCredits < 1}
                onClick={() => setDisplayStyle("model")}
                title="AI manken üzerinde (1 sahne kredisi)"
              >
                {sceneCredits < 1 ? "🔒 " : ""}
                Manken üzerinde
              </button>
            </div>
            <button
              type="button"
              className="rafla-btn rafla-btn-primary btn-block"
              disabled={busy || sceneCredits < sceneCost}
              onClick={() => void generateScene()}
            >
              <MaterialIcon name="brush" size={18} />
              Görseli optimize et ({sceneCost} kredi)
            </button>
            <button
              type="button"
              className="rafla-btn rafla-btn-secondary btn-block"
              disabled={busy || bgCredits < 1}
              onClick={() => void removeBg()}
            >
              Sadece arka planı kaldır
            </button>
          </section>

          <section className="card studio-panel">
            <p className="studio-section-label listing">İlan paketi</p>
            {analysis?.missingInfo && analysis.missingInfo.length > 0 && (
              <div className="missing-info-banner" role="status">
                <span aria-hidden>⚠️</span>
                <span>
                  <strong>Eksik bilgi:</strong>{" "}
                  {analysis.missingInfo.slice(0, 3).join(" · ")}
                </span>
              </div>
            )}
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
                {analysis.flaws?.slice(0, 2).map((f) => (
                  <span key={f} className="meta-chip">
                    Kusur: {f}
                  </span>
                ))}
                {analysis.missingInfo?.slice(0, 1).map((m) => (
                  <span key={m} className="meta-chip">
                    Eksik: {m}
                  </span>
                ))}
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
            <p className="field-label">Hedef platform</p>
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
              className="rafla-btn rafla-btn-primary btn-block"
              style={{ marginTop: "0.5rem" }}
              disabled={busy}
              onClick={() => void runFullPackage()}
            >
              <MaterialIcon name="auto_awesome" size={18} />
              Tam paket üret (Rafla)
            </button>
            <button
              type="button"
              className="btn btn-block"
              style={{ marginTop: "0.5rem" }}
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
          disabled={busy || sceneCredits < sceneCost}
          onClick={() => void generateScene()}
        >
          Sahne
        </button>
        <button type="button" className="btn" disabled={busy} onClick={() => void analyze()}>
          Analiz
        </button>
        <button
          type="button"
          className="btn"
          disabled={busy}
          onClick={() => void runFullPackage()}
        >
          Paket
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


