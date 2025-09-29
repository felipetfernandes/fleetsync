"use client"

import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building2,
  Car,
  ClipboardList,
  Edit,
  Trash2,
  PlusCircle,
  BarChart3,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import { useEffect, useState } from "react"
import type { Order, Vehicle, Workshop } from "@/types/types"
import { formatCurrency, formatShortDate } from "@/lib/utils/formatFunctions"
import { StatusBadge } from "@/components/ui/statusBadge"
import { OrderStatus, type VehicleStatus } from "@/types/enums"
import { fetchClientSide } from "@/lib/utils/fetchClientSide"
import OrderCard from "@/components/Order/orderCard"
import OrderForm from "@/components/Order/orderForm"

export default function WorkshopDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const workshopId = params.id
  const [tab, setTab] = useState("info")
  const [showForm, setShowForm] = useState(false)
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [vehiclesInMaintenance, setVehiclesInMaintenance] = useState<Vehicle[]>([])

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const data = await fetchClientSide<Workshop>("GET", `/workshops/${workshopId}?manager=true`)
        setWorkshop(data)
      } catch (error) {
        console.error("Erro ao buscar oficina:", error)
        // redirecionar para login se necessário
      }
    }

    const fetchOrders = async () => {
      try {
        const data = await fetchClientSide<Order[]>(
          "GET",
          `/orders?workshopId=${workshopId}&vehicle=true`, // Adicione o include do vehicle
        )
        if (data.length > 0) setOrders(data)
      } catch (error) {
        console.error("Erro ao buscar ordens de serviço:", error)
      }
    }

    const fetchVehiclesInMaintenance = async () => {
      try {
        const data = await fetchClientSide<Vehicle[]>("GET", `/workshops/${workshopId}/vehicles`)
        if (data.length > 0) setVehiclesInMaintenance(data)
      } catch (error) {
        console.error("Erro ao buscar veículos em manutenção:", error)
      }
    }

    fetchWorkshop()
    fetchOrders()
    fetchVehiclesInMaintenance()
  }, [workshopId])

  const handleDeleteWorkshop = async () => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta oficina?\nEsta ação é irreversível.")

    if (confirmDelete) {
      try {
        await fetchClientSide<Response>("DELETE", `/workshops/${workshopId}`)
        router.push("/workshops")
      } catch (error: any) {
        console.error("Erro ao deletar oficina:", error)
        // Aqui você pode adicionar uma lógica para exibir uma mensagem de erro ao usuário
      }
    } else {
      // O usuário cancelou a exclusão, nada acontece
      console.log("Exclusão da oficina cancelada pelo usuário.")
    }
  }

  // Calcular a distribuição de tipos de manutenção
  const maintenanceTypeDistribution = () => {
    const types = orders.reduce((acc: Record<string, number>, order) => {
      acc[order.type] = (acc[order.type] || 0) + 1
      return acc
    }, {})

    return Object.entries(types).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round(((count as number) / orders.length) * 100),
    }))
  }

  // Calcular resumo de serviços
  const servicesResume = (orders: Order[]) => {
    const today = new Date()
    const totalCost = orders.reduce((acc, order) => acc + order.totalCost, 0)
    const totalOrders = orders.length
    const averageCost = totalOrders > 0 ? totalCost / totalOrders : 0

    // Ordens em andamento
    const ordersInProgress = orders.filter((order) => order.status === "IN_PROGRESS" || order.status === "PENDING")

    // Ordens concluídas
    const completedOrders = orders.filter((order) => order.status === "COMPLETED")

    // Tempo médio de serviço (em dias)
    const averageServiceTime =
      completedOrders.length > 0
        ? completedOrders.reduce((acc, order) => {
            const startDate = new Date(order.startDate)
            const endDate = new Date(order.endDate || today)
            const diffInMs = endDate.getTime() - startDate.getTime()
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
            return acc + diffInDays
          }, 0) / completedOrders.length
        : 0

    // Ordem mais recente
    const mostRecent =
      orders.length > 0
        ? orders.reduce((latest, current) => {
            return new Date(current.startDate) > new Date(latest.startDate) ? current : latest
          })
        : { startDate: undefined }

    const diffTime = mostRecent.startDate ? Math.abs(today.getTime() - new Date(mostRecent.startDate).getTime()) : 0
    const daysSinceLast = mostRecent.startDate ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0

    return {
      totalCost,
      averageCost,
      totalOrders,
      ordersInProgress: ordersInProgress.length,
      completedOrders: completedOrders.length,
      averageServiceTime,
      mostRecent,
      daysSinceLast,
    }
  }

  // Filtrar ordens por status
  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter((order) => order.status === status)
  }

  if (!workshop) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center mb-8">
          <button
            className="mr-4 text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => router.push("/workshops")}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Building2 className="mr-3 h-10 w-10 text-indigo-400" />
                {workshop.name}
              </h1>
            </div>
            <p className="text-gray-400 mt-1">
              CNPJ: {workshop.cnpj} • {vehiclesInMaintenance.length} veículos em manutenção
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white py-2 px-5 border rounded flex flex-row items-center justify-center"
              onClick={() => router.push(`/workshops/${workshopId}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </button>
            <button
              className="bg-rose-900 hover:bg-rose-800 text-white py-2 px-5 rounded flex flex-row items-center justify-center"
              onClick={handleDeleteWorkshop}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </button>
          </div>
        </header>

        <div defaultValue="info" className="space-y-6">
          <div className="bg-gray-800 border-b border-gray-700 w-full justify-start rounded-none p-0 h-auto">
            <button
              value="info"
              onClick={(e) => setTab(e.currentTarget.value)}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-gray-950 py-3 text-gray-400 data-[state=active]:text-white p-4"
              data-state={tab === "info" ? "active" : "inactive"}
            >
              Informações
            </button>
            <button
              value="vehicles"
              onClick={(e) => setTab(e.currentTarget.value)}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-gray-950 py-3 text-gray-400 data-[state=active]:text-white p-4"
              data-state={tab === "vehicles" ? "active" : "inactive"}
            >
              Veículos em Manutenção
            </button>
            <button
              value="orders"
              onClick={(e) => setTab(e.currentTarget.value)}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-gray-950 py-3 text-gray-400 data-[state=active]:text-white p-4"
              data-state={tab === "orders" ? "active" : "inactive"}
            >
              Ordens de Serviço
            </button>
            <button
              value="stats"
              onClick={(e) => setTab(e.currentTarget.value)}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-gray-950 py-3 text-gray-400 data-[state=active]:text-white p-4"
              data-state={tab === "stats" ? "active" : "inactive"}
            >
              Estatísticas
            </button>
          </div>

          {/* Aba de Informações */}
          {tab === "info" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card de Informações da Oficina */}
                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">Dados da Oficina</h2>
                  </div>
                  <div className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Nome</h3>
                        <p className="font-medium">{workshop.name}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">CNPJ</h3>
                        <p className="font-medium">{workshop.cnpj}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Endereço</h3>
                        <p className="font-medium flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {workshop.address}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Contato</h3>
                        <p className="font-medium flex items-center">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          {workshop.phone}
                        </p>
                        <p className="font-medium flex items-center mt-1">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          {workshop.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card de Gerente da Oficina */}
                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">Gerente Responsável</h2>
                  </div>
                  <div className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Nome</h3>
                        <p className="font-medium">{workshop.manager?.name || "Não atribuído"}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
                        <p className="font-medium">{workshop.manager?.email || "Não atribuído"}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Telefone</h3>
                        <p className="font-medium">{workshop.manager?.phone || "Não atribuído"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card de Resumo de Serviços */}
                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">Resumo de Serviços</h2>
                  </div>
                  <div className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Total Faturado</h3>
                        <p className="font-medium text-lg text-emerald-400">
                          {formatCurrency(servicesResume(orders).totalCost)}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Ordens de Serviço</h3>
                        <p className="font-medium">{servicesResume(orders).totalOrders} ordens no total</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Serviços em Andamento</h3>
                        <p className="font-medium">{servicesResume(orders).ordersInProgress} ordens em aberto</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Tempo Médio de Serviço</h3>
                        <p className="font-medium">{servicesResume(orders).averageServiceTime.toFixed(1)} dias</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card de Veículos em Manutenção */}
                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">Veículos em Manutenção</h2>
                  </div>
                  <div className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Total de Veículos</h3>
                        <p className="font-medium">{vehiclesInMaintenance.length} veículos</p>
                      </div>

                      {vehiclesInMaintenance.length > 0 ? (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-400 mb-2">Veículos Recentes</h3>
                          <div className="space-y-2">
                            {vehiclesInMaintenance.slice(0, 3).map((vehicle) => (
                              <div
                                key={vehicle.id}
                                className="flex justify-between items-center p-2 bg-gray-800 rounded"
                                onClick={() => router.push(`/fleet/${vehicle.plate}`)}
                              >
                                <div className="flex items-center">
                                  <Car className="h-4 w-4 mr-2 text-indigo-400" />
                                  <span>{vehicle.plate}</span>
                                </div>
                                <span className="text-sm text-gray-400">
                                  {vehicle.brand} {vehicle.model}
                                </span>
                              </div>
                            ))}
                          </div>
                          {vehiclesInMaintenance.length > 3 && (
                            <button
                              className="text-indigo-400 text-sm mt-2 hover:text-indigo-300"
                              onClick={() => setTab("vehicles")}
                            >
                              Ver todos os veículos
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400">Nenhum veículo em manutenção no momento.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba de Veículos em Manutenção */}
          {tab === "vehicles" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Veículos em Manutenção</h2>
              </div>

              {vehiclesInMaintenance.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehiclesInMaintenance.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-gray-700 cursor-pointer"
                      onClick={() => router.push(`/fleet/${vehicle.plate}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <Car className="h-5 w-5 mr-2 text-indigo-400" />
                            <h3 className="text-lg font-medium">{vehicle.plate}</h3>
                          </div>
                          <p className="text-gray-400 mt-1">
                            {vehicle.brand} {vehicle.model} • {vehicle.modelYear}/{vehicle.manufactureYear}
                          </p>
                        </div>
                        <StatusBadge status={vehicle.status as VehicleStatus} type="vehicleStatus" />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400">Quilometragem</p>
                          <p className="font-medium">{vehicle.mileageCurrent} km</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400">Motorista</p>
                          <p className="font-medium">{vehicle.driver?.name || "Não atribuído"}</p>
                        </div>
                      </div>

                      {/* Ordens de serviço relacionadas a este veículo */}
                      {orders.filter(
                        (order) =>
                          order.vehicleId === vehicle.id &&
                          (order.status === "IN_PROGRESS" || order.status === "PENDING"),
                      ).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-800">
                          <p className="text-xs text-gray-400 mb-2">Serviços em andamento</p>
                          {orders
                            .filter(
                              (order) =>
                                order.vehicleId === vehicle.id &&
                                (order.status === "IN_PROGRESS" || order.status === "PENDING"),
                            )
                            .slice(0, 1)
                            .map((order) => (
                              <div key={order.id} className="text-sm">
                                <div className="flex justify-between">
                                  <span>{order.description}</span>
                                  <StatusBadge status={order.status} type="orderStatus" />
                                </div>
                                <p className="text-gray-400 mt-1">Início: {formatShortDate(order.startDate)}</p>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900 border-gray-800">
                  <div className="p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
                      <Car className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-white">Nenhum veículo em manutenção</h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Esta oficina não possui veículos em manutenção no momento.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Aba de Ordens de Serviço */}
          {tab === "orders" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Histórico de Ordens de Serviço</h2>
                <button
                  className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm"
                  onClick={() => setShowForm(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Ordem
                </button>
              </div>

              {showForm && <OrderForm onCancel={() => setShowForm(false)} onSubmit={() => setShowForm(false)} />}

              {/* Filtros de status */}
              <div className="flex flex-wrap gap-2">
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                  Todas ({orders.length})
                </button>
                <button className="bg-yellow-900/30 hover:bg-yellow-900/50 text-yellow-400 px-3 py-1 rounded-full text-sm">
                  Pendentes ({getOrdersByStatus(OrderStatus.PENDING).length})
                </button>
                <button className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 px-3 py-1 rounded-full text-sm">
                  Em Andamento ({getOrdersByStatus(OrderStatus.IN_PROGRESS).length})
                </button>
                <button className="bg-green-900/30 hover:bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-sm">
                  Concluídas ({getOrdersByStatus(OrderStatus.COMPLETED).length})
                </button>
                <button className="bg-red-900/30 hover:bg-red-900/50 text-red-400 px-3 py-1 rounded-full text-sm">
                  Canceladas ({getOrdersByStatus(OrderStatus.CANCELLED).length})
                </button>
              </div>

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="bg-gray-900 border-gray-800">
                    <div className="p-8 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
                        <ClipboardList className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-white">Nenhuma ordem de serviço</h3>
                      <p className="mt-2 text-sm text-gray-400">
                        Esta oficina ainda não possui ordens de serviço registradas.
                      </p>
                    </div>
                  </div>
                ) : (
                  orders.map((order) => <OrderCard key={order.id} order={order} vehicle={order.vehicle} />)
                )}
              </div>
            </div>
          )}

          {/* Aba de Estatísticas */}
          {tab === "stats" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Estatísticas e Análises</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card de Resumo Financeiro */}
                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">Resumo Financeiro</h2>
                  </div>
                  <div className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Faturamento Total</h3>
                        <p className="font-medium text-lg text-emerald-400">
                          {formatCurrency(servicesResume(orders).totalCost)}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Ticket Médio</h3>
                        <p className="font-medium">{formatCurrency(servicesResume(orders).averageCost)}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Serviços Realizados</h3>
                        <p className="font-medium">{servicesResume(orders).completedOrders} concluídos</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Serviços em Andamento</h3>
                        <p className="font-medium">{servicesResume(orders).ordersInProgress} em aberto</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card de Distribuição de Serviços */}
                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">Distribuição de Serviços</h2>
                  </div>
                  <div className="mt-4">
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        {maintenanceTypeDistribution().map((item) => (
                          <div key={item.type} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{item.type}</span>
                              <span className="text-sm">{item.percentage}%</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full">
                              <div
                                className="h-full bg-indigo-600 rounded-full"
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">Sem dados suficientes para análise.</p>
                    )}
                  </div>
                </div>

                {/* Card de Análise Temporal */}
                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl col-span-1 md:col-span-2">
                  <div>
                    <h2 className="text-xl font-bold">Análise Temporal</h2>
                  </div>
                  <div className="mt-4">
                    {orders.length > 0 ? (
                      <div className="h-64 flex items-center justify-center">
                        <p className="text-gray-400 flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2" />
                          Gráfico de análise temporal seria exibido aqui
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-400">Sem dados suficientes para análise temporal.</p>
                    )}
                  </div>
                </div>

                {/* Card de Serviços Mais Comuns */}
                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">Serviços Mais Comuns</h2>
                  </div>
                  <div className="mt-4">
                    {orders.length > 0 ? (
                      <div className="space-y-3">
                        {/* Aqui seria uma lista dos serviços mais comuns baseados nos OrderItems */}
                        <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                          <span>Troca de óleo</span>
                          <span className="text-sm text-gray-400">32%</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                          <span>Alinhamento e balanceamento</span>
                          <span className="text-sm text-gray-400">24%</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                          <span>Revisão de freios</span>
                          <span className="text-sm text-gray-400">18%</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                          <span>Troca de filtros</span>
                          <span className="text-sm text-gray-400">15%</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-800 rounded">
                          <span>Outros serviços</span>
                          <span className="text-sm text-gray-400">11%</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400">Sem dados suficientes para análise.</p>
                    )}
                  </div>
                </div>

                {/* Card de Eficiência */}
                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">Eficiência da Oficina</h2>
                  </div>
                  <div className="mt-4">
                    {orders.length > 0 ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Tempo Médio de Serviço</h3>
                          <p className="font-medium">{servicesResume(orders).averageServiceTime.toFixed(1)} dias</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Taxa de Conclusão</h3>
                          <p className="font-medium">
                            {orders.length > 0
                              ? Math.round((servicesResume(orders).completedOrders / orders.length) * 100)
                              : 0}
                            %
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Capacidade Atual</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{vehiclesInMaintenance.length} veículos em manutenção</span>
                            </div>
                            <div className="h-2 bg-gray-800 rounded-full">
                              <div
                                className="h-full bg-emerald-600 rounded-full"
                                style={{ width: `${Math.min(vehiclesInMaintenance.length * 10, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400">Sem dados suficientes para análise.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
