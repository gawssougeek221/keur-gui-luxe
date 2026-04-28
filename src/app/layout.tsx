import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Keur Gui Luxe - Haute Couture Sénégalaise",
  description: "Decouvrez les collections exclusives de haute couture senegalaise. Luxe, heritage et modernite au coeur du Senegal.",
  keywords: "haute couture, senegal, luxe, mode, fashion, dakar, collections, premium, keur gui luxe",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "#000", color: "#fff", overflowX: "hidden" }}
      >
        {children}
      </body>
    </html>
  );
}
