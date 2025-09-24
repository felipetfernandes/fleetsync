"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, UserCircle, Mail, Phone, Car, Shield, Users } from "lucide-react"
import { useEffect, useState } from "react"
import type { User } from "@/types/types"
import { fetchClientSide } from "@/lib/utils/fetchClientSide"
import Link from "next/link"
import { UserRole } from "@/types/enums"

export default function BranchTeamPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const branchId = params.id
  const [team, setTeam] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true)
        const data = await fetchClientSide<User[]>(
          "GET",
          `/branchs/${branchId}/team`
        )
        setTeam(data)
      } catch (error) {
        console.error("Erro ao buscar equipe:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeam()
  }, [branchId])

  const getRoleInfo = (role: UserRole) => {
    switch (role) {
      case UserRole.DRIVER:
        return { 
          label: "Motorista", 
          color: "bg-blue-900/30 text-blue-400",
          icon: <Car className="h-4 w-4" />
        }
      case UserRole.BRANCH_MANAGER:
        return { 
          label: "Gerente de Filial", 
          color: "bg-emerald-900/30 text-emerald-400",
          icon: <Users className="h-4 w-4" />
        }
      case UserRole.ADMIN:
        return { 
          label: "Administrador", 
          color: "bg-purple-900/30 text-purple-400",
          icon: <Shield className="h-4 w-4" />
        }
      default:
        return { 
          label: role, 
          color: "bg-gray-900/30 text-gray-400",
          icon: <UserCircle className="h-4 w-4" />
        }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4">Carregando equipe...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center mb-8">
          <button
            className="mr-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
            onClick={() => router.push(`/branchs/${branchId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Users className="mr-3 h-8 w-8 text-indigo-400" />
              Equipe da Filial
            </h1>
            <p className="text-gray-400 mt-1">Total de {team.length} membros</p>
          </div>
        </header>

        {team.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => {
              const roleInfo = getRoleInfo(member.role)
              return (
                <Link href={`/team/${member.id}`} key={member.id}>
                  <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="bg-gray-800 rounded-full p-3 mr-4">
                          <UserCircle className="h-10 w-10 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{member.name}</h3>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${roleInfo.color} mt-1`}>
                            {roleInfo.icon}
                            <span className="ml-1">{roleInfo.label}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-300">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm">{member.email}</span>
                      </div>

                      <div className="flex items-center text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm">{member.phone}</span>
                      </div>

                      {member.role === UserRole.DRIVER && member.vehicle && (
                        <div className="flex items-center text-gray-300">
                          <Car className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm">
                            {member.vehicle.plate} - {member.vehicle.model}
                          </span>
                        </div>
                      )}
                    </div>

                    {member.emailVerified && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <span className="text-xs text-emerald-400">✓ Email verificado</span>
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
            <Users className="h-12 w-12 mx-auto text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-white">Nenhum membro na equipe</h3>
            <p className="mt-2 text-sm text-gray-400">Esta filial ainda não possui membros cadastrados.</p>
          </div>
        )}
      </div>
    </div>
  )
}