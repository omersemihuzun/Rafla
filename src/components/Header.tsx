import Link from "next/link";

export function Header() {
  return (
    <header
      style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(12, 18, 16, 0.85)",
        backdropFilter: "blur(8px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.85rem 1.25rem",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <span
            style={{
              fontSize: "1.35rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Rafla
          </span>
          <span
            style={{
              display: "block",
              fontSize: "0.7rem",
              color: "var(--muted)",
              fontWeight: 400,
            }}
          >
            İkinci el vitrin stüdyosu
          </span>
        </Link>
        <span className="badge">Gemini AI</span>
      </div>
    </header>
  );
}
