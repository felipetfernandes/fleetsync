"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, ClipboardList, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import type { Order } from "@/types/types"
import { fetchClientSide } from "@/lib/utils/fetchClientSide"
import Link from "next/link"
import { StatusBadge } from "@/components/ui/statusBadge"
import { formatShortDate } from "@/lib/utils/formatFunctions"

export default function BranchOrdersPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const branchId = params.id
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await fetchClientSide<Order[]>(
          "GET",
          `/branchs/${branchId}/orders`
        )
        setOrders(data)
      } catch (error) {
        console.error("Erro ao buscar ordens:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [branchId])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "IN_PROGRESS":
        return <AlertCircle className="h-4 w-4" />
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4">Carregando ordens...</p>
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
              <ClipboardList className="mr-3 h-8 w-8 text-indigo-400" />
              Ordens de Serviço da Filial
            </h1>
            <p className="text-gray-400 mt-1">Total de {orders.length} ordens</p>
          </div>
        </header>

        {orders.length > 0 ? (
          <div className="grid gap-4">
            {orders.map((order) => (
              <Link href={`/orders/${order.id}`} key={order.id}>
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-800 rounded-lg">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">
                          {order.vehicle?.plate} - {order.vehicle?.brand} {order.vehicle?.model}
                        </h3>
                        <p className="text-gray-400">{order.type}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Oficina: {order.workshop?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={order.status} type="orderStatus" />
                      <p className="text-lg font-semibold mt-2">{formatCurrency(order.totalCost)}</p>
                      <p className="text-sm text-gray-400">{formatShortDate(order.startDate)}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
            <ClipboardList className="h-12 w-12 mx-auto text-gray-600" />
            <h3 className="mt-4 text-lg font-medium text-white">Nenhuma ordem encontrada</h3>
            <p className="mt-2 text-sm text-gray-400">Esta filial ainda não possui ordens de serviço.</p>
          </div>
        )}
      </div>
    </div>
  )
}