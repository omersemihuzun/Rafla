import type { Metadata, Viewport } from "next";
import { Inter, Libre_Caslon_Text } from "next/font/google";
import Link from "next/link";
import { Header } from "@/components/Header";
import "@fontsource-variable/material-symbols-outlined";
import "./globals.css";
import "./rafla-emerald.css";
import "./rafla-light.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-serif",
  display: "swap",
});
export const metadata: Metadata = {
  title: "Rafla — Seçkin Butikler ve İkinci El için AI Vitrin Stüdyosu",
  description:
    "Telefon fotoğrafından temiz görsel ve hazır ilan metni. Seçkin butik satıcıları için.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${inter.variable} ${libreCaslon.variable}`}>
      <head />
      <body className={`rafla-emerald ${inter.className}`}>
        <Header />
        {children}
        <footer className="site-footer footer-emerald">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <h3>RAFLA</h3>
                <p>
                  Seçkin ikinci el satıcıları ve lüks butikler için yapay zeka destekli vitrin fotoğraf stüdyosu.
                </p>
                <div className="footer-socials">
                  <a href="#" className="footer-social-link" aria-label="Instagram">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </a>
                  <a href="#" className="footer-social-link" aria-label="Twitter">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </a>
                  <a href="#" className="footer-social-link" aria-label="LinkedIn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                </div>
              </div>

              <div className="footer-col">
                <h4>Ürün</h4>
                <ul className="footer-links">
                  <li><Link href="/#yukle">Fotoğraf Yükle</Link></li>
                  <li><Link href="/#araclar">Özellikler</Link></li>
                  <li><Link href="/pricing">Fiyatlandırma</Link></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>Kurumsal</h4>
                <ul className="footer-links">
                  <li><Link href="#">Hakkımızda</Link></li>
                  <li><Link href="#">Kullanım Koşulları</Link></li>
                  <li><Link href="#">Gizlilik Politikası</Link></li>
                  <li><Link href="#">KVKK Aydınlatma</Link></li>
                </ul>
              </div>

              <div className="footer-col">
                <h4>İletişim</h4>
                <ul className="footer-links">
                  <li><a href="mailto:destek@rafla.com">destek@rafla.com</a></li>
                  <li><span>İstanbul, Türkiye</span></li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <p>© 2026 Rafla. Tüm hakları saklıdır.</p>
              <div className="footer-bottom-links">
                <Link href="#">Gizlilik</Link>
                <Link href="#">Koşullar</Link>
                <Link href="#">Çerez Tercihleri</Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
