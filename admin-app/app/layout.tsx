import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: " Pure Veg Tamarind — Admin",
//   description: "Admin dashboard for The Tamarind Pure Veg restaurant.",
// }
export const metadata: Metadata = {
  title: ' The Tamarind Pure Veg — Pure Vegetarian Indian Dining & Table Reservations',
  description:
    'Admin dashboard for The Tamarind Pure Veg restaurant',
  generator: 'Pure Veg Tamarind',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}