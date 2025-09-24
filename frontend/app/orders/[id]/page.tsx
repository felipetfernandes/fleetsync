"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ClipboardList, CheckCircle2, Phone, X } from "lucide-react"
import VehicleCard from "@/components/Vehicle/vehicleCard"
import WorkshopCard from "@/components/Workshops/workshopCard"
import OrderFullCard from "@/components/Order/orderFullCard"
import type { PageProps } from "@/.next/types/app/layout"
import type { Order } from "@/types/types"
import { fetchClientSide } from "@/lib/utils/fetchClientSide"
import { useRouter } from "next/navigation"
import { OrderStatus } from "@/types/enums"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OrderDetailPage({ params }: PageProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false)

  const router = useRouter()

  const getStatusLabel = (status: OrderStatus): string => {
    const statusLabels = {
      [OrderStatus.PENDING]: "Pendente",
      [OrderStatus.APPROVED]: "Aprovado",
      [OrderStatus.IN_PROGRESS]: "Em Progresso",
      [OrderStatus.COMPLETED]: "Concluído",
      [OrderStatus.CANCELLED]: "Cancelado",
    }
    return statusLabels[status]
  }

  const handleUpdateStatus = async () => {
    if (!selectedStatus || !order) return

    setUpdatingStatus(true)
    try {
      const updatedOrder = await fetchClientSide<Order>("PATCH", `/orders/${order.id}`, { status: selectedStatus })

      setOrder(updatedOrder)
      setShowStatusModal(false)
      setSelectedStatus(null)

      // Opcional: mostrar uma mensagem de sucesso
      console.log("Status atualizado com sucesso!")
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      // Opcional: mostrar uma mensagem de erro
    } finally {
      setUpdatingStatus(false)
    }
  }

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchClientSide<Order>(
          "GET",
          `/orders/${params.id}?vehicle=driver&workshop=true&company=true`,
        )
        setOrder(data)
      } catch (err) {
        console.error("Erro ao buscar ordem:", err)
        setError("Erro ao carregar os dados da ordem.")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        <p>Ordem não encontrada.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center mb-8">
          <button onClick={() => router.back()} aria-label="Voltar" className="mr-4 p-2 hover:bg-gray-800 rounded-md">
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Detalhes da Ordem de Serviço</h1>
            <p className="text-gray-400 mt-1">Ordem #{order.id}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal - Informações da ordem */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <OrderFullCard order={order} />

            <VehicleCard vehicle={order.vehicle} />

            {/* TODO: implementar Histórico de Status futuramente */}
          </div>

          {/* Coluna lateral - Informações da oficina */}
          <div className="space-y-6">
            <WorkshopCard workshop={order.workshop} />
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div className="pb-2">
                <h2 className="text-xl font-bold">Ações</h2>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="flex items-center justify-center p-2 w-full rounded-md bg-indigo-600 hover:bg-indigo-700"
                  aria-label="Atualizar Status"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Atualizar Status
                </button>

                <button
                  onClick={() => console.log("Gerar Relatório")}
                  className="flex items-center justify-center p-2 w-full bg-gray-950 border rounded-md border-gray-700 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  aria-label="Gerar Relatório"
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </button>

                <button
                  onClick={() => console.log("Contatar Oficina")}
                  className="flex items-center justify-center p-2 w-full bg-gray-950 border rounded-md border-gray-700 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  aria-label="Contatar Oficina"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Contatar Oficina
                </button>
              </div>
            </div>
          </div>
        </div>

        {showStatusModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Atualizar Status da Ordem</h3>
                <button
                  onClick={() => {
                    setShowStatusModal(false)
                    setSelectedStatus(null)
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">
                  Status atual: <span className="text-white">{getStatusLabel(order.status)}</span>
                </p>
                <p className="text-sm text-gray-400 mb-4">Selecione o novo status:</p>

                <Select value={selectedStatus || ""} onValueChange={(value) => setSelectedStatus(value as OrderStatus)}>
                  <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {Object.values(OrderStatus).map((status) => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="text-white hover:bg-gray-700"
                        disabled={status === order.status}
                      >
                        {getStatusLabel(status)}
                        {status === order.status && " (atual)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowStatusModal(false)
                    setSelectedStatus(null)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                  disabled={updatingStatus}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={!selectedStatus || updatingStatus || selectedStatus === order.status}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md"
                >
                  {updatingStatus ? "Atualizando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
