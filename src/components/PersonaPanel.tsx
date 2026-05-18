type PersonaData = {
  personas?: { name: string; comment: string; concerns?: string[] }[];
  topFixes?: string[];
};

export function PersonaPanel({ review }: { review: unknown }) {
  const data = review as PersonaData;
  const personas = data.personas ?? [];
  const fixes = data.topFixes ?? [];

  return (
    <section className="card" style={{ padding: "1.25rem", marginTop: "1rem" }}>
      <h2 style={{ marginTop: 0, fontSize: "1rem" }}>Alıcı önizlemesi</h2>
      {personas.map((p) => (
        <div
          key={p.name}
          style={{
            marginBottom: "1rem",
            paddingBottom: "0.75rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <strong style={{ color: "var(--accent)" }}>{p.name}</strong>
          <p style={{ margin: "0.35rem 0", lineHeight: 1.55 }}>{p.comment}</p>
          {p.concerns && p.concerns.length > 0 && (
            <ul
              style={{
                margin: "0.35rem 0 0",
                paddingLeft: "1.2rem",
                color: "var(--muted)",
                fontSize: "0.9rem",
              }}
            >
              {p.concerns.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {fixes.length > 0 && (
        <>
          <h3 style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
            Önerilen iyileştirmeler
          </h3>
          <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
            {fixes.map((f, i) => (
              <li key={i} style={{ marginBottom: "0.35rem" }}>
                {f}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
