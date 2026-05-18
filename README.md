# Rafla

İkinci el kıyafet satıcıları için AI destekli vitrin stüdyosu. Telefon fotoğrafından arka plan temizliği ve Dolap / Gardrops için hazır ilan metni.

## Özellikler

- Arka plan kaldırma (ücretsiz başlangıç paketi)
- Gemini ile ürün analizi (kategori, kusur, eksik bilgi)
- Platforma uygun ilan metni (Dolap, Gardrops)
- Alıcı önizlemesi — ilanı yayınlamadan geri bildirim
- Tek tıkla kopyala-yapıştır export

## Gereksinimler

- Node.js 18+
- Python 3.10+ (arka plan servisi için)
- [Google AI Studio](https://aistudio.google.com/apikey) API anahtarı

## Kurulum

```bash
npm install
cp .env.example .env
# .env içine GEMINI_API_KEY ekle

npm run db:push
npm run dev
```

Uygulama: http://localhost:3000

### Arka plan servisi (önerilir)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Teknoloji

- **Frontend:** Next.js, TypeScript
- **AI:** Google Gemini API
- **Arka plan:** rembg (Python), FastAPI
- **Veritabanı:** SQLite + Prisma

## Lisans

MIT
