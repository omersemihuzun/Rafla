"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const path = usePathname();
  const dark = path === "/" || path.startsWith("/studio");

  return (
    <header className={`site-header${dark ? " site-header-dark" : ""}`}>
      <div className="container site-header-inner">
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <span className="brand-title">Rafla</span>
          <span className="brand-sub">İkinci el vitrin stüdyosu</span>
        </Link>
        <nav className="nav-links" aria-label="Ana menü">
          <Link href="/#araclar" className="btn btn-ghost btn-sm">
            Araçlar
          </Link>
          <Link href="/#sss" className="btn btn-ghost btn-sm">
            SSS
          </Link>
          <span className="badge">Gemini AI</span>
        </nav>
      </div>
    </header>
  );
}
