"use client";

import { useState } from "react";

const FAQ = [
  {
    q: "Mevcut telefon fotoğraflarımla çalışır mı?",
    a: "Evet. Yatak, kapı veya askı önü çekimler yeterli. Rafla önce görseli temizler, sonra ürünü analiz edip ilan metnini üretir.",
  },
  {
    q: "AI kullanmak Dolap / Gardrops kurallarına uygun mu? Sahte görünür mü?",
    a: "Arka plan temizliği ve metin önerisi, ürünü değiştirmeden vitrin kalitesini artırır. Sahne ve manken üretimi (Pro) açıkça AI çıktısıdır; yayınlamadan önce alıcı önizlemesiyle metni kontrol edebilirsiniz.",
  },
  {
    q: "Prompt veya karmaşık AI araçları öğrenmem gerekir mi?",
    a: "Hayır. Fotoğraf yükle, stüdyoda adımları izle — Gemini arka planda çalışır. Tek tıkla kopyala-yapıştır paket alırsınız.",
  },
  {
    q: "Dolap ve Gardrops ilanlarında kullanabilir miyim?",
    a: "Evet. Platforma özel başlık ve açıklama formatı üretilir; metni doğrudan ilanına yapıştırabilirsin.",
  },
  {
    q: "AI görselleştirme / vitrin özelliği nasıl çalışır?",
    a: "Ürün fotoğrafından arka plan kaldırılır (rembg + isteğe bağlı AI sahne). Ayrıca kategori, beden ve kusur analizi yapılır — Studioify’dan farklı olarak sadece görsel değil, satılabilir ilan paketi hedeflenir.",
  },
  {
    q: "Hangi fotoğraflar en iyi sonucu verir?",
    a: "Doğal gün ışığı, ürün kadrajın ortada, mümkünse düz açı. Çok karanlık veya aşırı filtreli çekimlerde renk sapması olabilir.",
  },
  {
    q: "İlan başına ne kadar zaman kazanırım?",
    a: "Tipik akış: yükle → arka plan → analiz → metin → kopyala. Birkaç dakikalık manuel iş, yaklaşık 30 saniyelik stüdyo akışına iner.",
  },
  {
    q: "Daha iyi fotoğraflar gerçekten daha çok satış getirir mi?",
    a: "Temiz vitrin ve net açıklama tıklanma ve güveni artırır. Rafla bunu görsel + metin + alıcı geri bildirimiyle birlikte verir.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="faq-section" id="sss">
      <h2 className="landing-serif">İkinci el satıcılar için SSS</h2>
      <p className="faq-lead">
        Studioify tarzı vitrin kalitesi — Dolap ve Gardrops odaklı ilan paketi
      </p>
      <div className="faq-list">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className={`faq-item${isOpen ? " faq-item-open" : ""}`}>
              <button
                type="button"
                className="faq-question"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <span>{item.q}</span>
                <span className="faq-chevron" aria-hidden>
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && <p className="faq-answer">{item.a}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
