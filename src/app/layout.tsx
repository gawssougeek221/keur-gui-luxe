import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AfriqueLuxe - Haute Couture Africaine",
  description: "Decouvrez les collections exclusives de haute couture africaine. Luxe, heritage et modernite au coeur de l'Afrique.",
  keywords: "haute couture, afrique, luxe, mode, fashion, collections, premium",
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
