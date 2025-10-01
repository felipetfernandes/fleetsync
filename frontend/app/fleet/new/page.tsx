"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import VehicleForm from "@/components/Vehicle/vehicleForm"

export default function NewVehiclePage() {
  const router = useRouter()

  const handleFormSuccess = () => {
    router.push("/fleet")
  }

  const handleCancel = () => {
    router.push("/fleet")
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center mb-8">
          <button
            className="mr-4 text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded"
            onClick={() => router.push("/fleet")}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Adicionar Novo Veículo</h1>
            <p className="text-gray-400 mt-1">Preencha os dados do veículo</p>
          </div>
        </header>

        <VehicleForm onSubmit={handleFormSuccess} onCancel={handleCancel} />
      </div>
    </div>
  )
}
