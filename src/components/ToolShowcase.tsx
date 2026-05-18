const TOOLS = [
  {
    title: "Arka planı kaldır",
    desc: "Yatak veya kapı önü çekimlerini vitrin kalitesine çevirin.",
    emoji: "✂️",
    gradient: "linear-gradient(135deg, #e8f5ee 0%, #c8ebe0 100%)",
  },
  {
    title: "AI ürün analizi",
    desc: "Kategori, beden, kusur ve eksik bilgiyi Gemini ile çıkarın.",
    emoji: "🔍",
    gradient: "linear-gradient(135deg, #eef4ff 0%, #d4e4ff 100%)",
  },
  {
    title: "Platform ilan metni",
    desc: "Dolap ve Gardrops formatında hazır başlık ve açıklama.",
    emoji: "📝",
    gradient: "linear-gradient(135deg, #fff5e8 0%, #ffe4c8 100%)",
  },
  {
    title: "Alıcı önizlemesi",
    desc: "Yayınlamadan önce alıcı gözüyle geri bildirim alın.",
    emoji: "👁️",
    gradient: "linear-gradient(135deg, #f5eeff 0%, #e4d4ff 100%)",
  },
];

export function ToolShowcase() {
  return (
    <section style={{ marginTop: "3.5rem" }}>
      <h2 className="section-title">Rafla AI araçları</h2>
      <p className="section-sub">
        Tek ekranda vitrin, analiz ve ilan — ikinci el satıcıya özel
      </p>
      <div className="tool-grid">
        {TOOLS.map((t) => (
          <article key={t.title} className="tool-card">
            <div
              className="tool-card-visual"
              style={{ background: t.gradient }}
            >
              <span role="img" aria-hidden>
                {t.emoji}
              </span>
            </div>
            <div className="tool-card-body">
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
