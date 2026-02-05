import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sangboken - Norske barnesanger med akkorder",
    template: "%s | Sangboken",
  },
  description:
    "Gratis sangbok med gitarakkorder for norske barnesanger. Vis på TV, spill fra mobilen.",
  keywords: ["sangbok", "akkorder", "gitarakkorder", "barnesanger", "norske sanger"],
  authors: [{ name: "Sangboken" }],
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: "Sangboken",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
