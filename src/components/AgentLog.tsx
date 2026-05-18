type Run = {
  agent: string;
  status: string;
  createdAt: string;
};

type LocalLine = {
  time: string;
  text: string;
};

const AGENT_LABELS: Record<string, string> = {
  analyze: "Analiz",
  "generate-copy": "Metin",
  "persona-review": "Alıcı",
  "remove-bg": "Arka plan",
};

type Props = {
  runs: Run[];
  local: LocalLine[];
};

export function AgentLog({ runs, local }: Props) {
  const hasAny = runs.length > 0 || local.length > 0;

  return (
    <section className="card studio-panel">
      <h2>Agent günlüğü</h2>
      <p className="studio-panel-desc">
        Her AI adımı kayıt altında — şeffaf otomasyon
      </p>
      <div className="agent-log">
        {!hasAny && (
          <p style={{ margin: 0, color: "var(--muted)" }}>Henüz işlem yok</p>
        )}
        {runs.map((r) => (
          <div key={`${r.agent}-${r.createdAt}`} className="agent-log-item">
            <span className="agent-log-time">
              {new Date(r.createdAt).toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="agent-log-agent">
              {AGENT_LABELS[r.agent] ?? r.agent}
            </span>
            <span>{r.status === "ok" ? "tamamlandı" : r.status}</span>
          </div>
        ))}
        {local.map((line, i) => (
          <div key={`local-${i}`} className="agent-log-item">
            <span className="agent-log-time">{line.time}</span>
            <span>{line.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
