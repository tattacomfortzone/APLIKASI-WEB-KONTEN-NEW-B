import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SoloHitz — Portal Berita Wisata, Kuliner & Budaya Solo",
    template: "%s | SoloHitz",
  },
  description: "Jelajahi cerita, pesona wisata, kelezatan kuliner, dan kekayaan budaya Kota Solo terlengkap dan terkini.",
  keywords: ["Solo", "Surakarta", "Wisata Solo", "Kuliner Solo", "Budaya Solo", "Berita Solo", "SoloHitz"],
  authors: [{ name: "Redaksi SoloHitz" }],
  openGraph: {
    title: "SoloHitz — Cerita dan Pesona Kota Solo",
    description: "Temukan berita terbaru tentang wisata, kuliner, dan budaya Solo.",
    siteName: "SoloHitz",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans bg-[#FAFAFA] text-[#1D1D1D] antialiased">
        {children}
      </body>
    </html>
  );
}
