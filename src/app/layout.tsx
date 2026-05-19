import type { Metadata, Viewport } from "next";
import { Inter, Libre_Caslon_Text } from "next/font/google";
import { Header } from "@/components/Header";
import "./globals.css";
import "./rafla-theme.css";
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
    <html lang="tr" className={`${inter.variable} ${libreCaslon.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL@24,400,0,1&display=block"
          rel="stylesheet"
        />
      </head>
      <body className={`rafla-light ${inter.className}`}>
        <Header />
        {children}
        <footer className="site-footer footer-light">
          <div className="container">
            Rafla · Dolap ve Gardrops satıcıları için AI vitrin ve ilan stüdyosu
          </div>
        </footer>
      </body>
    </html>
  );
}
