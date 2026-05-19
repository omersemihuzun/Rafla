"use client";

import { MaterialIcon } from "@/components/MaterialIcon";

const REVIEWS = [
  {
    name: "Aylin K.",
    time: "2 hafta önce",
    text: "Mükemmel sonuçlar! Butik hesabımdaki ürünler resmen bir lüks butik havasına büründü.",
    rating: 5,
    avatar: "", // Profil resmi (opsiyonel)
    beforeImg: "",
    afterImg: "/review-jacket.png",
  },
  {
    name: "Merve Y.",
    time: "1 ay önce",
    text: "Eskiden arka planı silmek için saatler harcıyordum. Şimdi saniyeler içinde lüks stüdyo kalitesinde görsellerim oluyor.",
    rating: 5,
    avatar: "",
    beforeImg: "",
    afterImg: "/review-dress.png",
  },
  {
    name: "Selin B.",
    time: "3 hafta önce",
    text: "Özellikle yapay zeka destekli ilan metinleri inanılmaz başarılı. Premium butiğim artık çok profesyonel.",
    rating: 5,
    avatar: "",
    beforeImg: "",
    afterImg: "/review-bag.png",
  },
  {
    name: "Burcu D.",
    time: "Yeni",
    text: "Sıradan bir oda fotoğrafını saniyeler içinde mermer zeminli mağaza vitrinine çeviriyor.",
    rating: 5,
    avatar: "",
    beforeImg: "",
    afterImg: "/review-jacket.png",
  },
  {
    name: "Zeynep O.",
    time: "1 hafta önce",
    text: "Premium hissi sadece görsellerde değil, açıklamalarında da hissettiriyor. Kesinlikle tavsiye ederim.",
    rating: 5,
    avatar: "",
    beforeImg: "",
    afterImg: "/review-dress.png",
  }
];

export function ReviewMarquee() {
  const marqueeItems = [...REVIEWS, ...REVIEWS];

  return (
    <section className="marquee-section">
      <div className="marquee-container">
        <div className="marquee-track">
          {marqueeItems.map((review, i) => (
            <article key={i} className="review-card">
              {(review.beforeImg || review.afterImg) && (
                <div className="review-showcase">
                  {review.beforeImg && (
                    <div className="review-showcase-half">
                      <span className="review-showcase-label">Önce</span>
                      <img src={review.beforeImg} alt="Öncesi" />
                    </div>
                  )}
                  {review.afterImg && (
                    <div className="review-showcase-half">
                      <span className="review-showcase-label">Sonra</span>
                      <img src={review.afterImg} alt="Sonrası" />
                    </div>
                  )}
                </div>
              )}
              
              <div className="review-content">
                <div className="review-header">
                  <div className="review-avatar">
                    {review.avatar ? (
                      <img src={review.avatar} alt={review.name} />
                    ) : (
                      <span>{review.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="review-meta">
                    <h4>{review.name}</h4>
                    <span className="review-time">{review.time}</span>
                  </div>
                </div>
                <div className="review-stars">
                  {[...Array(review.rating)].map((_, idx) => (
                    <MaterialIcon key={idx} name="star" size={16} />
                  ))}
                </div>
                <p className="review-text">"{review.text}"</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
