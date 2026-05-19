"use client";

import { useState } from "react";
import Link from "next/link";
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
        <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.05rem" }}>Bakiyeniz Tükendi</h2>
        <p className="studio-panel-desc" style={{ margin: 0 }}>
          Şu an premium özelliklerimizi deneyimlemeniz için davet usulü çalışıyoruz.{" "}
          Daha fazla kredi için <Link href="/pricing" style={{ color: "#476540", fontWeight: 600 }}>Fiyatlandırma</Link> sayfamızdan size uygun paketi seçebilir veya bizimle iletişime geçebilirsiniz.
        </p>
      </section>
    );
  }

  return (
    <section className="card credits-refill-card">
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <span style={{ color: "#D4AF37" }}>
          <MaterialIcon name="auto_awesome" size={20} />
        </span>
        <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Butik Kulübü Bakiye Desteği</h2>
      </div>
      <p className="studio-panel-desc" style={{ margin: "0 0 1.25rem", fontSize: "0.9rem" }}>
        Hackathon lansmanı boyunca <strong>3 lüks vitrin arka planı</strong> ve <strong>3 butik sahne</strong> bakiyenizi anında yenileyerek stüdyomuzu dilediğinizce test edebilirsiniz.
      </p>
      <button
        type="button"
        className="rafla-btn rafla-btn-primary"
        disabled={busy}
        onClick={() => void refill()}
      >
        <MaterialIcon name="refresh" size={18} />
        {busy ? "Yenileniyor…" : "Bakiyeyi Yenile"}
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
    </section>
  );
}
