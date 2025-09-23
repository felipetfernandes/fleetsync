"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import type { User } from "@/types/types"
import { fetchClientSide } from "@/lib/utils/fetchClientSide"
import UserEditForm from "@/components/User/userEditForm"

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const userId = params.id
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchClientSide<User>("GET", `/users/id/${userId}`)
        setUser(userData)
      } catch (error) {
        console.error("Erro ao buscar usuário:", error)
        router.push("/team")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId, router])

  const handleSubmit = async (updatedUser: User) => {
    // Redirecionar de volta para a página de detalhes
    router.push(`/team/${userId}`)
  }

  const handleCancel = () => {
    router.push(`/team/${userId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Usuário não encontrado</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center mb-8">
          <button
            className="mr-4 text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded"
            onClick={() => router.push(`/team/${userId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Editar Usuário</h1>
            <p className="text-gray-400 mt-1">Atualize as informações de {user.name}</p>
          </div>
        </header>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <UserEditForm user={user} onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  )
}
