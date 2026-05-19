import { MaterialIcon } from "@/components/MaterialIcon";

const BENTO = [
  {
    span: "bento-span-8",
    title: "Yapay zeka arka plan",
    stat: "Stüdyo Vitrini",
    desc: "Ev ortamında çekilen fotoğrafları saniyeler içinde profesyonel stüdyo ışığı ve lüks butik konseptli arka planlarla değiştirin.",
    icon: "wallpaper",
    dark: false,
  },
  {
    span: "bento-span-4",
    title: "Sanal manken",
    stat: "Dinamik Duruş",
    desc: "Askıdaki kıyafetlerinizi gerçekçi modeller üzerinde sergileyerek alıcıların ürünün üstündeki duruşunu görmesini sağlayın.",
    icon: "accessibility_new",
    dark: true,
    badge: "Beta",
  },
  {
    span: "bento-span-6",
    title: "AI ürün analizi",
    stat: "Otomatik Etiket",
    desc: "Kumaş türü, yaka kesimi, marka ve beden bilgilerini fotoğraftan otomatik çıkararak hata payını sıfıra indirin.",
    icon: "auto_awesome",
    dark: false,
  },
  {
    span: "bento-span-6",
    title: "Platform ilan metni",
    stat: "SEO Formatı",
    desc: "Arama algoritmasında üst sıralara çıkaran başlık ve lüks butik standartlarında profesyonel açıklama metinleri oluşturun.",
    icon: "edit_document",
    dark: false,
  },
];

export function ToolShowcase() {
  return (
    <section className="tools-bento-section page-enter page-enter-delay-1" id="araclar">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 className="section-title">Tek platform, 4 güçlü araç</h2>
          <p className="section-sub">
            Satışlarınızı artıracak profesyonel görseller oluşturmak için ihtiyacınız olan her şey tek yerde.
          </p>
        </div>
        <div className="tools-bento-grid">
          {BENTO.map((t) => (
            <article
              key={t.title}
              className={`bento-card ${t.span}${t.dark ? " bento-card-dark" : ""}`}
            >
              <div className="bento-icon">
                <MaterialIcon name={t.icon} size={26} />
              </div>
              <h3>{t.title}</h3>
              {t.stat && <div className="bento-stat">{t.stat}</div>}
              <p>{t.desc}</p>
              {t.badge && (
                <span className="bento-badge">
                  {t.badge}
                  <MaterialIcon name="bolt" size={14} />
                </span>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
