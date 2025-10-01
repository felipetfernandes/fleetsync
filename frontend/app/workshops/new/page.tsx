"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import WorkshopForm from "@/components/Workshops/workshopForm"

export default function NewWorkshopPage() {
  const router = useRouter()

  const handleSubmit = () => {
    // Redireciona para a página de oficinas após criar
    router.push("/workshops")
  }

  const handleCancel = () => {
    // Volta para a página anterior
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </button>

        <div className="bg-gray-900 rounded-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Adicionar Nova Oficina</h1>
            <p className="text-gray-400 mt-2">Preencha os dados da nova oficina parceira</p>
          </div>

          <WorkshopForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  )
}
