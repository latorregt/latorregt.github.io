import type { Metadata } from "next";
import { Playfair_Display, Inter, Great_Vibes } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SITE_URL } from "@/lib/boutique/brand";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap", weight: ["400", "500", "600", "700", "800"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap", weight: ["300", "400", "500", "600", "700"] });
const greatVibes = Great_Vibes({ variable: "--font-great-vibes", subsets: ["latin"], display: "swap", weight: ["400"] });

const GA_ID = "G-EK0DD0WE83";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Boutique La Torre | Ropa de marca en Santa Cruz del Quiché, Guatemala", template: "%s | Boutique La Torre" },
  description: "Boutique La Torre, moda y estilo en Santa Cruz del Quiché. Ropa de marca para hombre, mujer y niños con más de 30 años de servicio. Envíos a toda Guatemala.",
  keywords: ["Boutique La Torre", "ropa de marca Guatemala", "Santa Cruz del Quiché", "Hombre", "Mujer", "Niños", "Levi's", "Original Penguin", "Pierre Cardin", "Van Heusen", "Jordache", "Pepe", "Tienda de ropa"],
  authors: [{ name: "Boutique La Torre" }],
  creator: "Boutique La Torre",
  icons: { icon: "/icon.png", shortcut: "/icon.png", apple: "/icon.png" },
  openGraph: {
    title: "Boutique La Torre | Ropa de marca en Santa Cruz del Quiché",
    description: "Moda y estilo para él, para ella y los pequeños. Más de 30 años de servicio en Santa Cruz del Quiché, Guatemala.",
    url: SITE_URL,
    siteName: "Boutique La Torre",
    locale: "es_GT",
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Boutique La Torre iluminada de noche" }],
  },
  twitter: { card: "summary_large_image", title: "Boutique La Torre", description: "Moda y estilo para él, para ella y los pequeños. Santa Cruz del Quiché, Guatemala.", images: ["/og.jpg"] },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Script id="ga-tag" strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_ID}');`}
        </Script>
      </head>
      <body className={`${playfair.variable} ${inter.variable} ${greatVibes.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
