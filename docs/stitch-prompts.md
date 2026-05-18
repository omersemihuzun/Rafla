# Rafla — Google Stitch prompt paketi

## Stitch’te nasıl kullanılır (ekrandaki gibi)

1. Sol tarafta **Rafla Premium Resale Studio** projesini aç (yoksa yeni proje).
2. Ortadaki kutuda **Web** seçili olsun (Uygulama değil).
3. Model: **3.1 Pro** kalabilir.
4. Aşağıdaki **PROMPT 1 → 2 → 3 → 4** sırayla kopyala, kutuya yapıştır, gönder (ok ↑).
5. Her çıkan ekranı beğen → sonraki prompt. Hepsini bitirince screenshot’ları tek mesajda bana at.

Her prompt **tamamdır** (global stil dahil) — ek bir şey yapıştırmana gerek yok.

---

## PROMPT 1 — Landing (ilk bunu at)

```
Design a premium dark-mode SaaS marketing landing page, 1440px desktop, Web.

Brand Rafla — Turkish second-hand fashion sellers (Dolap & Gardrops). NOT Depop/Vinted.

Style: background #060606 subtle grid, cards #141414 border #2A2A2A radius 16px, text #F5F5F5 muted #9CA3AF, accent #3DFF9A. Serif headline, Inter UI. White pill primary CTA black text. Studioify-level polish. ALL visible text in Turkish.

Header: Logo Rafla | Stüdyo | Fiyatlandırma | Ücretsiz kredi (gift icon highlighted) | Türkçe | Kredi 3 | avatar

Hero centered:
- Badge: Dolap · Gardrops satıcıları için
- Headline serif: Rafla: Telefon fotoğrafından güvenilir ilan
- Subhead: Yatak veya kapı önü çekimini vitrin kalitesine çevirin. Gemini ile Dolap ve Gardrops'a yapıştırmaya hazır başlık ve açıklama. Stüdyo yok, prompt yok.
- Button white: Ücretsiz dene →
- Link: ÖNCE / SONRA GÖR
- Small: Dolap ve Gardrops satıcıları için optimize edildi.

Large outlined decorative text: DOLAP · GARDROPS · İKİNCİ EL

Upload card dashed border: Ürün fotoğrafı yükle | Sürükle-bırak, galeriden seç veya kameradan çek | badge Ücretsiz başla

Section Rafla AI araçları — 4 cards: Arka planı kaldır | AI ürün analizi | Platform ilan metni | Alıcı önizlemesi (short TR descriptions)

Section Daha iyi fotoğraf, daha hızlı satış — before/after split yellow labels önce/sonra + 3 benefit bullets Turkish

Section Dolap ve Gardrops için tasarlandı — one paragraph

Footer CTA: Dolap ve Gardrops satıcıları için temiz fotoğraf ve hızlı satış | button Stüdyoyu aç
```

---

## PROMPT 2 — Fiyatlandırma

```
Design a premium dark-mode pricing page, 1440px desktop, Web. Same Rafla design system as before (#060606, #141414 cards, #3DFF9A accent, Turkish text, Studioify-like).

Same header nav as Rafla.

Pill tabs: Aylık (badge Save %65) | Yıllık (Save %73) | Kredi paketi (selected white)

Title: Esnek kredi — ihtiyacın kadar öde
Subtitle: Yan gelir ve ara sıra satanlar için. Abonelik şart değil.
Checkmarks: Aylık zorunluluk yok · Taahhüt yok · Krediler süresiz

4 pricing cards:
1) Badge İlk satış için ideal — Başlangıç ~15 ilan paketi — ₺149 — 30+5 bonus kredi — pill ~₺4,2/ilan — white CTA Satışa bugün başla — ✓ Krediler süresiz
2) Badge En popüler — Satıcı ~35 ilan — ₺299 — 70+15 — ~₺3,5/ilan — white CTA
3) Güçlü ~70 ilan — ₺499 — 140+30 — ~₺2,9/ilan — dark CTA
4) Badge En avantajlı — Pro ~200 ilan — ₺999 — 400+100 — ~₺2/ilan — dark CTA

Bottom info box: Ücretsiz: Herkese 3 arka plan kredisi — demo stüdyoda dene

Small legend: Arka plan 1 kredi | Tam paket 1 kredi | Alıcı gözü ücretsiz ilk ilanlarda | AI sahne Pro 2 kredi (yakında)
```

---

## PROMPT 3 — Ücretsiz kredi (referral)

```
Design a premium dark-mode referral / free credits page, 1440px desktop, Web. Rafla design system, Turkish, Studioify Free Credits layout.

Same Rafla header. Eyebrow: Birlikte paylaş, birlikte kazan

Main card Davet linkin: URL field https://rafla.app/?ref=RAFLA2026 + green button Kopyala
Share row: X, WhatsApp, Telegram, Instagram DM

4 stat cards: Toplam davet 0 | Başarılı kayıt 0 | Kazanılan kredi 0 | Bu ay kalan hak 50

Section Nasıl çalışır? two cards:
A Kayıt ödülü — Arkadaşın linkinle kayıt olunca — Sen +2 arka plan kredisi — Arkadaşın +2 arka plan kredisi
B Satın alma ödülü — Arkadaşın paket alınca — Sen +6 kredi — Arkadaş başına ayda en fazla 2 kez

Small disclaimer Turkish fair use
```

---

## PROMPT 4 — Stüdyo (en önemli)

```
Design a premium dark-mode product studio editor, 1440px desktop, Web. Match getstudioify.com/studio layout. Rafla Turkish resale tool.

Header: ← Yeni ürün | Ürün stüdyosu | pills Arka plan 2/3 Sahne 0

Split layout:

LEFT sidebar scrollable dark cards:
Card 1 label GÖRSEL AÇIKLAMA blue micro type — Ürün fotoğrafını tanımla — product thumbnail — KIYAFET TİPİ * — chips Üst Alt Etek Elbise Şapka Ayakkabı Çanta Diğer (Üst selected white on black) — input placeholder ör. oversize hoodie / vintage denim

Card 2 label ÜRETİM STİLİ purple — chips Beyaz vitrin (selected) Düz sergi Ayna selfie (Pro locked) — white button Görseli optimize et

Card 3 İLAN PAKETİ — chips Dolap Gardrops — buttons AI analiz İlan metni üret — primary Tam paket üret (Rafla) — Alıcı gözü

RIGHT large preview: clothing before/after slider OR processing overlay monospace AI ÜRÜN GÖRSELİNİ İŞLİYOR… gradient progress 58% tip Dolap'ta beyaz fon en iyi sonuç

Bottom banner: Pro: AI manken ve ayna sahnesi — yakında

Colors #060606 #141414 #3DFF9A. No hackathon branding.
```

---

## PROMPT 5 — Stüdyo mobil (isteğe bağlı)

```
Design Rafla mobile studio 390px width dark mode. Preview top full width before/after. Below accordion panels Görsel İlan Alıcı. Sticky bottom bar BG Analiz Metin Alıcı. Turkish. Same colors as Rafla studio desktop.
```

---

## Hepsini tek promptta (deneysel — bazen tek ekran üretir)

Stitch çoğu zaman tek ekran üretir; olmazsa yukarıdaki 1-4’ü ayrı ayrı kullan.

```
Create a cohesive 4-screen dark-mode web design system for Rafla (Turkish Dolap/Gardrops resale studio). Screens at 1440px: 1 Landing 2 Pricing 3 Referral free credits 4 Studio editor split layout. Use specs from prompts: green accent #3DFF9A, black #060606, Turkish copy, Studioify polish, Rafla differentiator Tam paket üret and Alıcı gözü. Show all 4 screens side by side in one artboard.
```

---

# (Eski bölüm — parça parça referans)

Her ekran için **önce "Global design system"** bloğunu yapıştır, altına ilgili ekran promptunu ekle.  
Çıktıyı Figma’ya aktarırken frame adlarını: `Rafla / Landing`, `Rafla / Pricing` vb. yap.

---

## Global design system (her promptun başına ekle)

```
Design a premium dark-mode SaaS web app for Turkish second-hand fashion sellers (Dolap & Gardrops marketplaces).

Brand: Rafla — "phone photo to trustworthy listing"

Visual style (match Studioify-level polish):
- Background #060606 with subtle grid texture
- Cards #141414, border #2A2A2A, radius 16px
- Primary text #F5F5F5, muted #9CA3AF
- Accent green #3DFF9A for badges and success
- Secondary accents: purple-blue gradient only on progress bars
- Typography: serif for marketing headlines (Playfair/Georgia feel), Inter for UI
- White pill primary CTA buttons with black text
- Ghost/text secondary CTAs, uppercase micro labels
- Generous whitespace, 1440px desktop width
- Turkish language for ALL user-visible text
- No stock photos of random people unless product/model context
- Modern, trustworthy, resale-commerce aesthetic (not generic AI purple gradient slop)

Navigation header: Logo "Rafla" + links Stüdyo, Fiyatlandırma, Ücretsiz kredi (gift icon, highlighted) + TR language + credit counter pill + profile avatar.

Do NOT use hackathon branding. Product feels like a real startup.
```

---

## 1. Landing page (Desktop 1440)

```
[GLOBAL DESIGN SYSTEM ABOVE]

Screen: Marketing landing page — hero + social proof + upload + tools + FAQ teaser + footer CTA.

Hero (centered):
- Eyebrow badge: "Dolap · Gardrops satıcıları için"
- Headline (serif): "Rafla: Telefon fotoğrafından güvenilir ilan"
- Subhead: "Yatak veya kapı önü çekimini vitrin kalitesine çevirin. Gemini ile Dolap ve Gardrops'a yapıştırmaya hazır başlık ve açıklama. Stüdyo yok, prompt yok."
- Primary CTA button: "Ücretsiz dene →"
- Secondary link: "ÖNCE / SONRA GÖR"
- Small line: "Dolap ve Gardrops satıcıları için optimize edildi."
- Optional: two tilted floating product photo cards left/right (fashion items, B&W or muted)

Decorative marquee text (very large, outlined): "DOLAP · GARDROPS · İKİNCİ EL"

Section: Large dashed upload zone card
- Icon camera, title "Ürün fotoğrafı yükle"
- Hint "Sürükle-bırak, galeriden seç veya kameradan çek"
- Badge "Ücretsiz başla"

Section title: "Rafla AI araçları"
- 4 cards in a row (Photoroom "explore tools" style):
  1. Arka planı kaldır — scissors icon
  2. AI ürün analizi — magnifier
  3. Platform ilan metni — document
  4. Alıcı önizlemesi — eye
Each card: gradient top area + title + short Turkish description

Section: "Daha iyi fotoğraf, daha hızlı satış"
- Left: before/after split card with yellow labels "önce" / "sonra"
- Right: 3 benefit bullets (tıklanma, ilan paketi, zaman kazanma)

Section: "Dolap ve Gardrops için tasarlandı" — short paragraph

Footer CTA strip: "Dolap ve Gardrops satıcıları için temiz fotoğraf ve hızlı satış." + white button "Stüdyoyu aç"
```

---

## 2. Landing page (Mobile 390)

```
[GLOBAL DESIGN SYSTEM]

Mobile landing, single column, sticky bottom optional.
Same content as desktop but stacked: hero → upload → 2x2 tool grid → before/after → CTA.
Touch-friendly 48px buttons. Safe area padding bottom.
```

---

## 3. Pricing page (Desktop)

```
[GLOBAL DESIGN SYSTEM]

Screen: Pricing — "Flex Credits" pay-as-you-go (Studioify pricing clone structure, Rafla copy).

Top: pill toggle tabs — Aylık (badge Save 65%) | Yıllık (Save 73%) | Kredi paketi (selected, white fill)

Title: "Esnek kredi — ihtiyacın kadar öde"
Subtitle: "Yan gelir ve ara sıra satanlar için. Abonelik şart değil."
Checkmarks row: "Aylık zorunluluk yok" · "Taahhüt yok" · "Krediler süresiz"

4 pricing cards horizontal:

Card 1 — green badge "İlk satış için ideal"
- Başlangıç · ~15 ilan paketi
- ₺149 · 30 + 5 bonus kredi
- pill ~₺4,2/ilan
- white CTA "Satışa bugün başla"
- footer ✓ Krediler süresiz

Card 2 — purple badge "En popüler" 🔥
- Satıcı · ~35 ilan · ₺299 · 70+15 bonus · ~₺3,5/ilan · white CTA

Card 3 — Güçlü · ~70 ilan · ₺499 · 140+30 · ~₺2,9/ilan · dark CTA

Card 4 — blue badge "En avantajlı" 💎
- Pro · ~200 ilan · ₺999 · 400+100 · ~₺2/ilan · dark CTA

Below cards: small info box "Ücretsiz: Herkese 3 arka plan kredisi — demo stüdyoda dene"

Credit usage legend (small):
- Arka plan: 1 kredi | Tam paket: 1 kredi | Alıcı gözü: ücretsiz ilk ilanlarda | AI sahne Pro: 2 kredi (yakında)
```

---

## 4. Free Credits / Referral (Desktop)

```
[GLOBAL DESIGN SYSTEM]

Screen: Referral dashboard — dark cards, Studioify Free Credits layout.

Eyebrow: "Birlikte paylaş, birlikte kazan"

Main card "Davet linkin":
- URL field https://rafla.app/?ref=XXXXXX + green Copy button
- Row: Paylaş: X, WhatsApp, Telegram, Instagram DM (brand-colored icon buttons)

Stats row 4 small cards:
- Toplam davet: 0
- Başarılı kayıt: 0
- Kazanılan kredi: 0
- Bu ay kalan hak: 50

Section "Nasıl çalışır?" two cards side by side:

Card A "Kayıt ödülü" — When friend signs up with your link
- Sen +2 arka plan kredisi
- Arkadaşın +2 arka plan kredisi

Card B "Satın alma ödülü" — When friend buys a pack
- Sen +6 kredi
- Note: Arkadaş başına ayda en fazla 2 kez

Footer disclaimer: fair use / anti-abuse one line Turkish
```

---

## 5. Studio / Editor (Desktop) — Studioify studio layout

```
[GLOBAL DESIGN SYSTEM]

Screen: Product photo studio — split layout.

Top bar: back "← Yeni ürün" | title "Ürün stüdyosu" | pills "Arka plan 2/3" "Sahne 0"

LEFT COLUMN scrollable panels (dark cards):

Panel 1 — label "📸 GÖRSEL AÇIKLAMA" (blue micro label)
- Title: Ürün fotoğrafını tanımla
- Small product thumbnail
- Label KIYAFET TİPİ *
- Chip grid: Üst, Alt, Etek, Elbise, Şapka, Ayakkabı, Çanta, Diğer (one selected white)
- Input placeholder: "ör. oversize hoodie / vintage denim"

Panel 2 — label "✨ ÜRETİM STİLİ" (purple micro label)
- Chips: Beyaz vitrin (selected), Düz sergi, Ayna selfie (Pro, disabled/locked)
- White full-width button: "Görseli optimize et"

Panel 3 — label "📝 İLAN PAKETİ"
- Chips Dolap | Gardrops
- Buttons: AI analiz, İlan metni üret
- Primary: "Tam paket üret (Rafla)" — this is the differentiator
- Secondary: Alıcı gözü

RIGHT COLUMN large preview:
- Before/after image compare slider on hanger clothing photo
- OR processing state overlay: monospace "AI ÜRÜN GÖRSELİNİ İŞLİYOR…" + gradient progress 58% + tip text
- Bottom pro upsell banner: "Pro: AI manken ve ayna sahnesi — yakında"

Style: exactly like getstudioify.com/studio dark UI — segmented chips, section labels, not generic form.
```

---

## 6. Studio (Mobile 390)

```
[GLOBAL DESIGN SYSTEM]

Mobile studio: preview on top full width, accordion sections below OR bottom tab bar: BG | Analiz | Metin | Alıcı
Sticky bottom action bar with 4 icon buttons.
Processing overlay on preview when generating.
```

---

## 7. FAQ section (component)

```
[GLOBAL DESIGN SYSTEM]

Component: FAQ accordion on dark background, max-width 720px centered.

Title serif: "İkinci el satıcılar için SSS"
Subtitle muted: "Vitrin kalitesi ve hazır ilan paketi"

8 accordion items (only question visible, first expanded):
1. Mevcut telefon fotoğraflarımla çalışır mı?
2. AI kullanmak Dolap / Gardrops kurallarına uygun mu?
3. Prompt öğrenmem gerekir mi?
4. Dolap ve Gardrops ilanlarında kullanabilir miyim?
5. AI görselleştirme nasıl çalışır?
6. Hangi fotoğraflar en iyi sonucu verir?
7. İlan başına ne kadar zaman kazanırım?
8. Daha iyi fotoğraflar daha çok satış getirir mi?

Expanded answer example for Q3: "Hayır. Fotoğraf yükle, stüdyoda adımları izle..."
```

---

## Stitch kullanım sırası (önerilen)

1. **Landing desktop** → beğen → Export PNG veya Figma plugin
2. **Studio desktop** (en kritik — jüri/demo)
3. **Pricing**
4. **Free Credits**
5. **Mobile** variants sadece hero + studio

## Iterasyon promptları (düzeltme için)

**Daha Studioify gibi:**
```
Make it darker, more premium, smaller border radius on chips, white selected chip on black, add yellow before/after labels, reduce saturation, add subtle grid background.
```

**Daha Rafla farkı:**
```
Add visible "İlan paketi" and "Alıcı gözü" sections that Studioify doesn't have. Emphasize Dolap and Gardrops logos as text chips, not Depop/Vinted.
```

**Daha az AI-slop:**
```
Remove purple gradients on backgrounds. No generic 3D icons. Flat, editorial, fashion-resale aesthetic. Turkish typography only.
```

---

## Metin özeti (hızlı kopya)

| Yer | Metin |
|-----|--------|
| Hero | Rafla: Telefon fotoğrafından güvenilir ilan |
| CTA | Ücretsiz dene → |
| Nav highlight | Ücretsiz kredi |
| Pricing title | Esnek kredi — ihtiyacın kadar öde |
| Referral | Davet linkin |
| Studio CTA | Tam paket üret (Rafla) |

Tam SSS cevapları: projede `src/components/FaqSection.tsx`
