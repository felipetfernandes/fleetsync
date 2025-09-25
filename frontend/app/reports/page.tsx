import Link from "next/link"
import { ArrowLeft, Download, Calendar, TrendingUp, BarChart3, PieChart, FileText } from "lucide-react"
import type { Company } from "@/types/types"
import { fetchServerSide } from "@/lib/utils/fetchServerSide"
import MonthlyMaintenance from "@/components/charts/monthlyMaintenance"
import MaintenanceByType from "@/components/charts/maintenanceByType"
import CostByMaintenancyStatus from "@/components/charts/costByMaintenancyStatus"
import { CostByBranch } from "@/components/charts/costByBranch"
import { DataTable } from "@/components/ui/dataTable"
import { ordersInProgress } from "@/components/columns/ordersInProgress"
import { groupedOrdersByVehicle } from "@/components/columns/groupedOrdersByVehicle"
import { formatCurrency } from "@/lib/utils/formatFunctions"
import { buildDashboardData } from "@/lib/utils/buildDashboardData"

export default async function ReportsPage() {
  const [company] = await fetchServerSide<Company[]>(
    "GET",
    `/company?orders=vehicle,workshop,branch&vehicles=driver&workshops=orders`,
  )
  const { vehicles, orders, workshops } = company

  const dashboardData = buildDashboardData({
    vehicles,
    orders,
    workshops,
  })

  // Calcular estatísticas adicionais para relatórios
  const completedOrders = orders.filter((order) => order.status === "COMPLETED")
  const avgMaintenanceCost =
    completedOrders.length > 0
      ? completedOrders.reduce((sum, order) => sum + order.totalCost, 0) / completedOrders.length
      : 0

  const totalMaintenanceCost = orders.reduce((sum, order) => sum + order.totalCost, 0)

  const vehicleUtilization = vehicles
    .map((vehicle) => ({
      plate: vehicle.plate,
      brand: vehicle.brand,
      model: vehicle.model,
      ordersCount: orders.filter((order) => order.vehicleId === vehicle.id).length,
      totalCost: orders
        .filter((order) => order.vehicleId === vehicle.id)
        .reduce((sum, order) => sum + order.totalCost, 0),
      status: vehicle.status,
    }))
    .sort((a, b) => b.totalCost - a.totalCost)

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Relatórios</h1>
              <p className="text-gray-400 mt-1">Análise detalhada e estatísticas da frota</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Download className="h-4 w-4" />
              Exportar PDF
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Calendar className="h-4 w-4" />
              Filtrar Período
            </button>
          </div>
        </header>

        {/* Resumo Executivo */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-400" />
            Resumo Executivo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{formatCurrency(totalMaintenanceCost)}</div>
              <div className="text-sm text-gray-400">Custo Total de Manutenção</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{formatCurrency(avgMaintenanceCost)}</div>
              <div className="text-sm text-gray-400">Custo Médio por Manutenção</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{orders.length}</div>
              <div className="text-sm text-gray-400">Total de Ordens de Serviço</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{completedOrders.length}</div>
              <div className="text-sm text-gray-400">Ordens Concluídas</div>
            </div>
          </div>
        </div>

        {/* Seção de Gráficos */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            Análise Gráfica
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MaintenanceByType data={dashboardData._orderGroupedByType} />
            <MonthlyMaintenance chartData={dashboardData._orderGroupedByYearMonth} />
            <CostByMaintenancyStatus chartData={dashboardData._costByStatus} />
            <CostByBranch chartData={dashboardData._costByBranch} />
          </div>
        </div>

        {/* Análise por Veículo */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-indigo-400" />
            Análise por Veículo
          </h2>
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Veículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Marca/Modelo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Ordens de Serviço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Custo Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {vehicleUtilization.slice(0, 10).map((vehicle, index) => (
                    <tr key={vehicle.plate} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{vehicle.plate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {vehicle.brand} {vehicle.model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{vehicle.ordersCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatCurrency(vehicle.totalCost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            vehicle.status === "AVAILABLE"
                              ? "bg-green-900 text-green-200"
                              : vehicle.status === "MAINTENANCE"
                                ? "bg-yellow-900 text-yellow-200"
                                : "bg-red-900 text-red-200"
                          }`}
                        >
                          {vehicle.status === "AVAILABLE"
                            ? "Disponível"
                            : vehicle.status === "MAINTENANCE"
                              ? "Manutenção"
                              : "Indisponível"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tabelas Detalhadas */}
        <div className="grid grid-cols-1 gap-6">
          <DataTable
            columns={ordersInProgress}
            data={dashboardData._inProgress}
            header="Ordens em Andamento - Relatório Detalhado"
          />

          <DataTable
            columns={groupedOrdersByVehicle}
            data={dashboardData._ordersByVehicle}
            header="Histórico de Ordens por Veículo"
            grouped
          />
        </div>

        {/* Indicadores de Performance */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-400" />
            Indicadores de Performance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Taxa de Disponibilidade</h3>
              <div className="text-3xl font-bold text-emerald-400">
                {((dashboardData.fleetStatus.AVAILABLE / dashboardData.totalVehicles) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {dashboardData.fleetStatus.AVAILABLE} de {dashboardData.totalVehicles} veículos disponíveis
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Eficiência de Manutenção</h3>
              <div className="text-3xl font-bold text-blue-400">
                {((completedOrders.length / orders.length) * 100).toFixed(1)}%
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {completedOrders.length} de {orders.length} ordens concluídas
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Custo por Veículo</h3>
              <div className="text-3xl font-bold text-amber-400">
                {formatCurrency(totalMaintenanceCost / dashboardData.totalVehicles)}
              </div>
              <p className="text-sm text-gray-400 mt-2">Custo médio de manutenção por veículo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
