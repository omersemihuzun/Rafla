import type { Metadata, Viewport } from "next";
import { Inter, Libre_Caslon_Text } from "next/font/google";
import { Header } from "@/components/Header";
import "@fontsource-variable/material-symbols-outlined";
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
      <head />
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
