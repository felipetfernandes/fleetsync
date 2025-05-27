// app/layout.tsx

import type React from "react"
import "@/globals.css"
import { Inter } from "next/font/google"
// import { MainNav } from "@/components/common/mainNav"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Gestor de Frota",
  description: "Sistema de gerenciamento de frota de veículos",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-950`}>
        <main className="container mx-auto">{children}</main>
      </body>
    </html>
  )
}
