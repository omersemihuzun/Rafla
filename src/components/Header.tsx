"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const path = usePathname();
  const dark =
    path === "/" ||
    path.startsWith("/studio") ||
    path === "/pricing" ||
    path === "/credits";

  return (
    <header className={`site-header${dark ? " site-header-dark" : ""}`}>
      <div className="container site-header-inner">
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <span className="brand-title">Rafla</span>
          <span className="brand-sub">İkinci el vitrin stüdyosu</span>
        </Link>
        <nav className="nav-links" aria-label="Ana menü">
          <Link href="/#yukle" className="btn btn-ghost btn-sm">
            Stüdyo
          </Link>
          <Link href="/pricing" className="btn btn-ghost btn-sm">
            Fiyatlandırma
          </Link>
          <Link href="/credits" className="btn btn-ghost btn-sm credits-nav-link">
            🎁 Ücretsiz kredi
          </Link>
        </nav>
      </div>
    </header>
  );
}
