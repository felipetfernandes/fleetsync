// app/layout.tsx

import type React from "react"
import "@/globals.css"
import { Inter } from "next/font/google"

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
      <body className={`${inter.className} bg-gray-900`}>
        {children}
      </body>
    </html>
  )
}
