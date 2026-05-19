import { MaterialIcon } from "@/components/MaterialIcon";
import { SAMPLE_IMAGES } from "@/lib/sample-assets";

const BENTO = [
  {
    span: "bento-span-8",
    title: "Yapay zeka arka plan",
    desc: "Karmaşık ev ortamını lüks stüdyo veya sokak konseptine çevirin.",
    icon: "wallpaper",
    dark: false,
    image: SAMPLE_IMAGES.bentoBg,
  },
  {
    span: "bento-span-4",
    title: "Sanal manken",
    desc: "Askıdaki kıyafeti gerçekçi manken üzerinde gösterin.",
    icon: "accessibility_new",
    dark: true,
    badge: "Beta",
    image: SAMPLE_IMAGES.bentoModel,
  },
  {
    span: "bento-span-6",
    title: "AI ürün analizi",
    desc: "Marka, beden, kusur ve eksik bilgiyi otomatik çıkarın.",
    icon: "auto_awesome",
    dark: false,
  },
  {
    span: "bento-span-6",
    title: "Platform ilan metni",
    desc: "Dolap ve Gardrops için hazır başlık ve açıklama.",
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
              className={`bento-card ${t.span}${t.dark ? " bento-card-dark" : ""}${t.image ? " bento-card-has-image" : ""}`}
              style={
                t.image
                  ? { backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 45%, transparent 70%), url(${t.image})` }
                  : undefined
              }
            >
              <div className="bento-icon">
                <MaterialIcon name={t.icon} size={26} />
              </div>
              <h3>{t.title}</h3>
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
