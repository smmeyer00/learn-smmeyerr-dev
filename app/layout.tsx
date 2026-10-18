import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SearchPalette } from "@/components/search/search-palette";
import { buildSearchIndex } from "@/lib/search";
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
  metadataBase: new URL("https://learn.smmeyer.dev"),
  title: "Free System Design & LLM Engineering Courses | Learn",
  description:
    "Free technical study paths by Steven Meyer, with worked examples, interactive labs, design assignments, and interview practice. No account required.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "System Design & LLM Engineering | Learn",
    description:
      "Free study paths with worked examples, labs, assignments, and interview practice by Steven Meyer.",
    url: "/",
    siteName: "Learn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: "/opengraph-image",
        alt: "Free system design and LLM engineering study paths by Steven Meyer",
      },
    ],
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#11100e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const searchIndex = buildSearchIndex();
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:border focus:border-border focus:bg-card focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-foreground"
        >
          skip to content
        </a>
        {children}
        <SearchPalette index={searchIndex} />
      </body>
    </html>
  );
}
