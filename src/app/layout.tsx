import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const fontSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const fontMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteName = "FOCAra";
const siteUrl = "https://focara-seven.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FOCAra",
    template: "%s | FOCAra",
  },
  description:
    "Transforme texto livre em prompts estruturados com o método FOCO. Gere prompts claros, executáveis e organizados em Fato, Objetivo, Condições e Ok.",
  applicationName: siteName,
  keywords: [
    "gerador de prompt",
    "prompt builder",
    "método FOCO",
    "engenharia de prompt",
    "IA",
    "prompt estruturado",
    "Next.js",
    "OpenRouter",
  ],
  authors: [{ name: "Gadiego Nogueira" }],
  creator: "Gadiego Nogueira",
  publisher: "FOCAra",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName,
    title: "FOCAra",
    description:
      "Transforme texto livre em prompts estruturados com o método FOCO.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FOCAra",
    description:
      "Transforme texto livre em prompts estruturados com o método FOCO.",
    creator: "@gadiegon",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fontSans.variable} ${fontMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background font-sans text-text antialiased">
        <div className="flex min-h-dvh flex-col">{children}</div>
      </body>
    </html>
  );
}
