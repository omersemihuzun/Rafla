"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";

export function Header() {
  const path = usePathname();
  const [bgCredits, setBgCredits] = useState<number | null>(null);
  const [sceneCredits, setSceneCredits] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d: { bgCreditsRemaining?: number; sceneCredits?: number }) => {
        if (typeof d.bgCreditsRemaining === "number") setBgCredits(d.bgCreditsRemaining);
        if (typeof d.sceneCredits === "number") setSceneCredits(d.sceneCredits);
      })
      .catch(() => {});
  }, [path]);

  return (
    <header className="site-header site-header-light">
      <div className="container site-header-inner">
        <Link href="/" className="brand-link">
          <MaterialIcon name="auto_awesome" size={22} className="brand-icon" filled />
          <span className="brand-title">Rafla</span>
        </Link>
        <nav className="nav-links" aria-label="Ana menü">
          <Link
            href="/#yukle"
            className={`nav-link${path.startsWith("/studio") ? " nav-link-active" : ""}`}
          >
            Stüdyo
          </Link>
          <Link
            href="/pricing"
            className={`nav-link${path === "/pricing" ? " nav-link-active" : ""}`}
          >
            Fiyatlandırma
          </Link>
          <Link
            href="/credits"
            className={`nav-link nav-link-gift${path === "/credits" ? " nav-link-active" : ""}`}
          >
            <MaterialIcon name="card_giftcard" size={18} />
            Ücretsiz kredi
          </Link>
        </nav>
        <div className="header-actions">
          {bgCredits !== null && (
            <span className="header-credit-pill" title="Arka plan kredisi">
              <MaterialIcon name="image" size={18} />
              Arka plan {bgCredits}
            </span>
          )}
          {sceneCredits !== null && (
            <span className="header-credit-pill header-credit-pill-scene" title="Sahne kredisi (manken, vitrin)">
              <MaterialIcon name="auto_awesome" size={18} />
              Sahne {sceneCredits}
            </span>
          )}
          <Link href="/#yukle" className="header-cta">
            Başla
          </Link>
        </div>
      </div>
    </header>
  );
}
