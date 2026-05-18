import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rafla — Dolap ve Gardrops için AI vitrin stüdyosu",
  description:
    "Telefon fotoğrafından temiz görsel ve hazır ilan metni. İkinci el kıyafet satıcıları için.",
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
    <html lang="tr">
      <body>
        <Header />
        {children}
        <footer className="site-footer footer-dark">
          <div className="container">
            Rafla · Dolap ve Gardrops satıcıları için AI vitrin ve ilan stüdyosu
          </div>
        </footer>
      </body>
    </html>
  );
}
