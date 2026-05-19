"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";

type Props = {
  onRefilled?: (data: {
    bgCreditsRemaining: number;
    sceneCredits: number;
  }) => void;
};

export function RefillCreditsCard({ onRefilled }: Props) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const isDev = process.env.NODE_ENV === "development";

  const refill = async () => {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/dev/refill-credits", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yenileme başarısız");
      setMsg(data.message ?? "Krediler yenilendi");
      onRefilled?.({
        bgCreditsRemaining: data.bgCreditsRemaining,
        sceneCredits: data.sceneCredits,
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Hata");
    } finally {
      setBusy(false);
    }
  };

  if (!isDev) {
    return (
      <section className="card credits-refill-card">
        <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.05rem" }}>Kredi bitti mi?</h2>
        <p className="studio-panel-desc" style={{ margin: 0 }}>
          Demo sürümünde paket satın alma kapalı.{" "}
          <a href="/pricing">Fiyatlandırma</a> sayfasından paket seçeceksin (yakında). Şimdilik
          yeni gizli pencerede tekrar dene — yeni hesaba 3 arka plan + 3 sahne kredisi tanımlanır.
        </p>
      </section>
    );
  }

  return (
    <section className="card credits-refill-card">
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <MaterialIcon name="bolt" size={22} />
        <h2 style={{ margin: 0, fontSize: "1.05rem" }}>Demo: Kredileri yenile</h2>
      </div>
      <p className="studio-panel-desc" style={{ margin: "0 0 1rem" }}>
        Geliştirme ortamında tek tıkla <strong>3 arka plan</strong> + <strong>3 sahne</strong>{" "}
        kredisi yüklenir. Hackathon provası için.
      </p>
      <button
        type="button"
        className="rafla-btn rafla-btn-primary"
        disabled={busy}
        onClick={() => void refill()}
      >
        <MaterialIcon name="refresh" size={18} />
        {busy ? "Yükleniyor…" : "Kredileri yenile"}
      </button>
      {msg && (
        <p className="credits-refill-ok" role="status">
          {msg}
        </p>
      )}
      {err && (
        <p className="credits-refill-err" role="alert">
          {err}
        </p>
      )}
      <p className="pricing-legend" style={{ marginTop: "0.75rem", marginBottom: 0 }}>
        Terminal alternatifi:{" "}
        <code style={{ fontSize: "0.75rem" }}>
          curl -X POST http://localhost:3000/api/dev/refill-credits
        </code>
      </p>
    </section>
  );
}
