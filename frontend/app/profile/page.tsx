"use client"

import type { User } from "@/types/types"
import { fetchClientSide } from "@/lib/utils/fetchClientSide"
import { useEffect, useState } from "react"
import { UserRound, Mail, Phone, Calendar, CreditCard, Building2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await fetchClientSide<User>("GET", "/auth/me")
        setUser(data)
      } catch (error) {
        console.error("Erro ao carregar perfil:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white">Erro ao carregar perfil</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-800">
            <div className="h-24 w-24 bg-indigo-600 rounded-full flex items-center justify-center">
              <UserRound className="h-12 w-12 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{user.name}</h2>
              <p className="text-indigo-400 font-medium mb-1">{user.role}</p>
              <p className="text-gray-400 text-sm">
                Membro desde {new Date(user.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Informações de Contato</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-indigo-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-indigo-400" />
                  <div>
                    <p className="text-sm text-gray-400">Telefone</p>
                    <p className="text-white">{user.phone || "Não informado"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-indigo-400" />
                  <div>
                    <p className="text-sm text-gray-400">Filial</p>
                    <p className="text-white">{user.branch?.name || "Não informado"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* License Information (if applicable) */}
            {user.licenseNumber && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Informações da CNH</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-gray-400">Número da CNH</p>
                      <p className="text-white">{user.licenseNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-gray-400">Categoria</p>
                      <p className="text-white">{user.licenseCategory || "Não informado"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-indigo-400" />
                    <div>
                      <p className="text-sm text-gray-400">Vencimento</p>
                      <p className="text-white">
                        {user.licenseExpiration
                          ? new Date(user.licenseExpiration).toLocaleDateString("pt-BR")
                          : "Não informado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Account Status */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Status da Conta</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${user.emailVerified ? "bg-green-500" : "bg-red-500"}`}></div>
                  <div>
                    <p className="text-sm text-gray-400">Email Verificado</p>
                    <p className="text-white">{user.emailVerified ? "Sim" : "Não"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-indigo-400" />
                  <div>
                    <p className="text-sm text-gray-400">Última Atualização</p>
                    <p className="text-white">{new Date(user.updatedAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-8 border-t border-gray-800">
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Editar Perfil
            </button>
            <button className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Alterar Senha
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
