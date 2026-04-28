import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const base = "/mobile-twitter";

export const metadata: Metadata = {
  title: "Mobile — 时间线",
  description: "Next.js 重构的移动风格时间线预览（GitHub Pages）",
  metadataBase: new URL("https://allen2dev.github.io"),
  openGraph: {
    title: "Mobile Twitter — Demo",
    description: "现代化 UI + Motion 动效的静态演示站点",
    url: `${base}`,
    siteName: "mobile-twitter",
    locale: "zh_CN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0f14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body className="font-sans min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
