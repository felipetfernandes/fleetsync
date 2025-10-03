import Link from "next/link"
import { Car, Wrench, ClipboardList, TrendingUp, BarChart3, ArrowUpRight, KeyRound, AlertTriangle } from "lucide-react"
import type { Company } from "@/types/types"
import { fetchServerSide } from "@/lib/utils/fetchServerSide"
import MonthlyMaintenance from "@/components/charts/monthlyMaintenance"
import MaintenanceByType from "@/components/charts/maintenanceByType"
import CostByMaintenancyStatus from "@/components/charts/costByMaintenancyStatus"
import { CostByBranch } from "@/components/charts/costByBranch"
import { DataTable } from "@/components/ui/dataTable"
import { ordersInProgress } from "@/components/columns/ordersInProgress"
import { ordersCompleted } from "@/components/columns/ordersCompleted"
import { groupedOrdersByVehicle } from "@/components/columns/groupedOrdersByVehicle"
import { formatCurrency } from "@/lib/utils/formatFunctions"
import { buildDashboardData } from "@/lib/utils/buildDashboardData"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Visão geral da sua frota e manutenções</p>
        </header>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">Total de Veículos</h2>
              <Car className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{dashboardData.totalVehicles}</div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">Diponíveis</h2>
              <KeyRound className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-2xl font-bold">{dashboardData.fleetStatus.AVAILABLE}</span>
              <span className="text-2xl font-thin text-gray-400">
                {(dashboardData.fleetStatus.AVAILABLE / dashboardData.totalVehicles) * 100}%
              </span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">Em Manutenção</h2>
              <Wrench className="h-4 w-4 text-amber-400" />
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-2xl font-bold">{dashboardData.fleetStatus.MAINTENANCE}</span>
              <span className="text-2xl font-thin text-gray-400">
                {(dashboardData.fleetStatus.MAINTENANCE / dashboardData.totalVehicles) * 100}%
              </span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">Indisponíveis</h2>
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-2xl font-bold">{dashboardData.fleetStatus.UNAVAILABLE}</span>
              <span className="text-2xl font-thin text-gray-400">
                {(dashboardData.fleetStatus.UNAVAILABLE / dashboardData.totalVehicles) * 100}%
              </span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">Ordens Pendentes</h2>
              <ClipboardList className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">{dashboardData.pendingOrders}</div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">Gastos do Mês</h2>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold flex justify-between">
                {formatCurrency(dashboardData.monthlyExpenses[0].value)}
                <p className="text-xs text-gray-400 mt-1">
                  <span className="text-rose-400 inline-flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {(() => {
                      const currentValue = dashboardData.monthlyExpenses[0]?.value || 0
                      const previousValue = dashboardData.monthlyExpenses[1]?.value || 0
                      if (previousValue === 0) return "0.00"
                      const percentage = ((currentValue - previousValue) / previousValue) * 100
                      return isFinite(percentage) ? percentage.toFixed(2) : "0.00"
                    })()}{" "}
                  </span>{" "}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de tipos de manutenção */}
          <MaintenanceByType data={dashboardData._orderGroupedByType} />

          {/* Gráfico de gastos mensais */}
          <MonthlyMaintenance chartData={dashboardData._orderGroupedByYearMonth} />

          {/* Gráfico de custo de manutenção por status */}
          <CostByMaintenancyStatus chartData={dashboardData._costByStatus} />

          {/* Gráfico de custo de manutenção por filial */}
          <CostByBranch chartData={dashboardData._costByBranch} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Ordens em Andamento */}
          <DataTable columns={ordersInProgress} data={dashboardData._inProgress} header="Ordens em Andamento" />

          {/* Ordens Concluídas */}
          <DataTable columns={ordersCompleted} data={dashboardData._completed} header="Ordens Concluídas" />

          {/* Ordens por Veículo */}
          <DataTable
            columns={groupedOrdersByVehicle}
            data={dashboardData._ordersByVehicle}
            header="Ordens por Veículo"
            grouped
          />
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

          <Link href="/reports">
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
