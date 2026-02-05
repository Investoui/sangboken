import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#111113" },
    { media: "(prefers-color-scheme: light)", color: "#111113" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Sangboken - Den digitale sangboken med gitarakkorder",
    template: "%s | Sangboken",
  },
  description:
    "Den digitale sangboken med gitarakkorder. Norske sanger for hele familien – gratis på mobil, nettbrett og storskjerm.",
  keywords: [
    "sangbok",
    "akkorder",
    "gitarakkorder",
    "barnesanger",
    "norske sanger",
    "gitargrep",
    "allsang",
    "viser",
    "AirPlay",
    "Chromecast",
  ],
  authors: [{ name: "Sangboken" }],
  creator: "Sangboken",
  publisher: "Sangboken",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: "Sangboken",
    title: "Sangboken - Den digitale sangboken med gitarakkorder",
    description:
      "Den digitale sangboken med gitarakkorder. Gratis på mobil, nettbrett og storskjerm.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sangboken - Digital sangbok med gitarakkorder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sangboken - Den digitale sangboken med gitarakkorder",
    description:
      "Den digitale sangboken med gitarakkorder. Gratis på mobil, nettbrett og storskjerm.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sangboken",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased bg-[var(--bg-base)] text-[var(--text-primary)] min-h-screen no-overscroll">
        {children}
      </body>
    </html>
  );
}
