import type { Metadata } from "next";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rafla — İkinci el vitrin stüdyosu",
  description:
    "Telefon fotoğrafından temiz görsel ve hazır ilan metni. Dolap ve Gardrops için.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        <Header />
        {children}
        <footer
          style={{
            borderTop: "1px solid var(--border)",
            padding: "1.5rem",
            textAlign: "center",
            color: "var(--muted)",
            fontSize: "0.8rem",
          }}
        >
          Rafla · Gemini ile güçlendirilmiş ikinci el satıcı stüdyosu
        </footer>
      </body>
    </html>
  );
}
