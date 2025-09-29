"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import type { Workshop } from "@/types/types"
import { fetchClientSide } from "@/lib/utils/fetchClientSide"
import WorkshopEditForm from "@/components/Workshops/workshopEditForm"

export default function EditWorkshopPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const workshopId = params.id
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const workshopData = await fetchClientSide<Workshop>("GET", `/workshops/${workshopId}`)
        setWorkshop(workshopData)
      } catch (error) {
        console.error("Erro ao buscar oficina:", error)
        router.push("/workshops")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkshop()
  }, [workshopId, router])

  const handleSubmit = async (updatedWorkshop: Workshop) => {
    // Redirecionar de volta para a página de detalhes
    router.push(`/workshops/${workshopId}`)
  }

  const handleCancel = () => {
    router.push(`/workshops/${workshopId}`)
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

  if (!workshop) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Oficina não encontrada</div>
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
            onClick={() => router.push(`/workshops/${workshopId}`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Editar Oficina</h1>
            <p className="text-gray-400 mt-1">Atualize as informações de {workshop.name}</p>
          </div>
        </header>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <WorkshopEditForm workshop={workshop} onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  )
}
