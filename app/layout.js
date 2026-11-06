import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PwaRegister from "@/components/PwaRegister";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://blitzcardz.vercel.app"),
  title: {
    default: "blitzcardz — anime card data API",
    template: "%s · blitzcardz"
  },
  description:
    "Anime card data API by Blitz. 36,000+ cards across 1,900+ series over a free JSON API, synced hourly.",
  applicationName: "blitzcardz",
  authors: [{ name: "Blitz" }],
  creator: "Blitz",
  publisher: "Blitz",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: "/icons/apple-touch-icon.png"
  },
  openGraph: {
    type: "website",
    siteName: "blitzcardz",
    title: "blitzcardz — anime card data API",
    description: "36,000+ anime cards across 1,900+ series. Free JSON API, synced hourly. Built by Blitz.",
    images: ["/thumbnail.png"]
  },
  twitter: {
    card: "summary_large_image",
    title: "blitzcardz — anime card data API",
    description: "36,000+ anime cards across 1,900+ series. Free JSON API, synced hourly.",
    images: ["/thumbnail.png"]
  },
  appleWebApp: {
    capable: true,
    title: "blitzcardz",
    statusBarStyle: "black-translucent"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070b14"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PwaRegister />
        <Nav />
        <main className="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
