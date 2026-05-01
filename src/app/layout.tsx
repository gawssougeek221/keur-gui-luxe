import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: "Keur Gui Luxe - Haute Couture Sénégalaise",
  description: "Decouvrez les collections exclusives de haute couture senegalaise. Luxe, heritage et modernite au coeur du Senegal.",
  keywords: "haute couture, senegal, luxe, mode, fashion, dakar, collections, premium, keur gui luxe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} antialiased`}
        style={{ backgroundColor: "#000", color: "#fff", overflowX: "hidden" }}
      >
        {children}
      </body>
    </html>
  );
}
