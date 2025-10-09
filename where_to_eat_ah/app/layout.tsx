import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/pwa/service-worker-register";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const APP_NAME = "Where To Eat Ah?";
const APP_DESCRIPTION = "Check if your favorite hawker center is open today. Real-time closure information for all Singapore hawker centers based on quarterly cleaning schedules and maintenance.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: "Where To Eat Ah? | Singapore Hawker Centers",
    template: "%s | Where To Eat Ah?",
  },
  description: APP_DESCRIPTION,
  keywords: ["Singapore", "hawker centers", "food", "dining", "closures", "open", "closed", "PWA", "offline"],
  authors: [{ name: "Where To Eat Ah?" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: "Where To Eat Ah? | Singapore Hawker Centers",
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Where To Eat Ah? | Singapore Hawker Centers",
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* PWA Primary Meta Tags */}
        <meta name="application-name" content={APP_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-192.png" />

        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        <ServiceWorkerRegister />
        <div className="relative min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
