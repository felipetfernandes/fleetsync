"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Car,
  Wrench,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
} from "lucide-react"
import { DashboardService } from "@/lib/mock-service"

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar dados do dashboard
    const data = DashboardService.getStats()
    setDashboardData(data)
    setLoading(false)
  }, [])

  // Formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  // Função para obter o ícone e a cor do status
  function getStatusInfo(status: string) {
    switch (status) {
      case "Agendado":
        return { icon: <Calendar className="h-4 w-4" />, color: "bg-blue-600" }
      case "Em Andamento":
        return { icon: <RotateCcw className="h-4 w-4" />, color: "bg-amber-600" }
      case "Concluído":
        return { icon: <CheckCircle2 className="h-4 w-4" />, color: "bg-emerald-600" }
      case "Cancelado":
        return { icon: <AlertCircle className="h-4 w-4" />, color: "bg-rose-600" }
      default:
        return { icon: <Clock className="h-4 w-4" />, color: "bg-gray-600" }
    }
  }

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Visão geral da sua frota e manutenções</p>
        </header>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">Total de Veículos</h2>
              <Car className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{dashboardData.stats.totalVehicles}</div>
              <p className="text-xs text-gray-400 mt-1">
                <span className="text-emerald-400 inline-flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  4%
                </span>{" "}
                desde o último mês
              </p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">Em Manutenção</h2>
              <Wrench className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{dashboardData.stats.vehiclesInMaintenance}</div>
              <p className="text-xs text-gray-400 mt-1">
                <span className="text-rose-400 inline-flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  2%
                </span>{" "}
                desde a semana passada
              </p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">Ordens Pendentes</h2>
              <ClipboardList className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{dashboardData.stats.pendingOrders}</div>
              <p className="text-xs text-gray-400 mt-1">
                <span className="text-emerald-400 inline-flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  12%
                </span>{" "}
                de conclusão este mês
              </p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">Gastos do Mês</h2>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{formatCurrency(dashboardData.stats.totalCostThisMonth)}</div>
              <p className="text-xs text-gray-400 mt-1">
                <span className="text-rose-400 inline-flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  8%
                </span>{" "}
                comparado ao mês anterior
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Gráfico de status dos veículos */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div>
              <h2 className="text-lg font-bold">Status da Frota</h2>
              <div className="text-gray-400">Distribuição dos veículos por status</div>
            </div>
            <div>
              <div className="space-y-4">
                {dashboardData.vehiclesByStatus.map((item: any) => {
                  const totalVehiclesForChart = dashboardData.vehiclesByStatus.reduce(
                    (acc: number, item: any) => acc + item.count,
                    0,
                  )
                  return (
                    <div key={item.status} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                          <span className="text-sm">{item.status}</span>
                        </div>
                        <span className="text-sm font-medium">
                          {item.count} ({Math.round((item.count / totalVehiclesForChart) * 100)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-800">
                        <div className={`h-full ${item.color} rounded-full`}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Gráfico de tipos de manutenção */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div>
              <h2 className="text-lg font-bold">Tipos de Manutenção</h2>
              <div className="text-gray-400">Distribuição por tipo de serviço</div>
            </div>
            <div>
              <div className="space-y-4">
                {dashboardData.maintenanceByType.map((item: any, index: number) => {
                  const colors = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"]
                  return (
                    <div key={item.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-2`}></div>
                          <span className="text-sm">{item.type}</span>
                        </div>
                        <span className="text-sm font-medium">{item.percentage}%</span>
                      </div>
                      <div className="h-2 bg-gray-800">
                        <div className={`h-full ${colors[index % colors.length]} rounded-full`}></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Gráfico de gastos mensais */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div>
              <h2 className="text-lg font-bold">Gastos Mensais</h2>
              <div className="text-gray-400">Custos de manutenção por mês</div>
            </div>
            <div>
              <div className="h-[220px] flex items-end justify-between gap-2">
                {dashboardData.monthlyExpenses.map((item: any) => {
                  const maxValue = Math.max(...dashboardData.monthlyExpenses.map((i: any) => i.value))
                  const height = (item.value / maxValue) * 100
                  return (
                    <div key={item.month} className="flex flex-col items-center gap-2">
                      <div
                        className="w-12 bg-indigo-600 hover:bg-indigo-500 rounded-t-md transition-all duration-200"
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs font-medium">{item.month}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ordens recentes */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Ordens Recentes</h2>
                <Link href="/ordens">
                  <button className="text-indigo-400 hover:text-indigo-300 p-0 h-auto">
                    Ver todas
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
            <div>
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order: any) => {
                  const statusInfo = getStatusInfo(order.status)
                  return (
                    <Link href={`/orders/${order.id}`} key={order.id}>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors">
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-md ${statusInfo.color}`}>{statusInfo.icon}</div>
                          <div>
                            <h3 className="font-medium">
                              {order.vehiclePlate} - {order.vehicleModel}
                            </h3>
                            <p className="text-sm text-gray-400">{order.serviceType}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {order.workshopName} • {order.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`px-2 py-0.5 rounded-full text-sm ${statusInfo.color}`}>{order.status}</p>
                          <p className="text-sm font-medium mt-1">{formatCurrency(order.cost)}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Oficinas principais */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Oficinas Principais</h2>
                <Link href="/oficinas">
                  <button className="text-indigo-400 hover:text-indigo-300 p-0 h-auto">
                    Ver todas
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
            <div>
              <div className="space-y-4">
                {dashboardData.topWorkshops.map((workshop: any, index: number) => (
                  <div
                    key={workshop.name}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium">{workshop.name}</h3>
                        <div className="flex items-center mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 ${i < Math.floor(workshop.rating) ? "text-yellow-400" : "text-gray-600"}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                          <span className="text-xs text-gray-400 ml-1">{workshop.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{workshop.ordersCount} ordens</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Links rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <Link href="/fleet">
            <div className="bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer h-full">
              <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Car className="h-10 w-10 text-indigo-400 mb-4" />
                <h3 className="font-bold text-lg mb-1">Gerenciar Frota</h3>
                <p className="text-sm text-gray-400">Visualize e gerencie todos os veículos</p>
              </div>
            </div>
          </Link>

          <Link href="/workshops">
            <div className="bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer h-full">
              <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Wrench className="h-10 w-10 text-indigo-400 mb-4" />
                <h3 className="font-bold text-lg mb-1">Oficinas</h3>
                <p className="text-sm text-gray-400">Gerencie oficinas parceiras</p>
              </div>
            </div>
          </Link>

          <Link href="/orders">
            <div className="bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer h-full">
              <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                <ClipboardList className="h-10 w-10 text-indigo-400 mb-4" />
                <h3 className="font-bold text-lg mb-1">Ordens de Serviço</h3>
                <p className="text-sm text-gray-400">Acompanhe todas as manutenções</p>
              </div>
            </div>
          </Link>

          <Link href="/relatorios">
            <div className="bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer h-full">
              <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                <BarChart3 className="h-10 w-10 text-indigo-400 mb-4" />
                <h3 className="font-bold text-lg mb-1">Relatórios</h3>
                <p className="text-sm text-gray-400">Análise detalhada e estatísticas</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
