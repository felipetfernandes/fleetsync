import Link from "next/link";
import {
  Car,
  Wrench,
  ClipboardList,
  TrendingUp,
  BarChart3,
  ArrowRight,
  ArrowUpRight,
  KeyRound,
  AlertTriangle,
} from "lucide-react";
import * as dfd from "danfojs";
import { Company, Order, Vehicle, Workshop } from "@/types/types";
import { fetchServerSide } from "@/lib/utils/fetchServerSide";
import MonthlyMaintenance from "@/components/charts/monthlyMaintenance";
import MaintenanceByType from "@/components/charts/maintenanceByType";
import CostByMaintenancyStatus from "@/components/charts/costByMaintenancyStatus";
import { CostByBranch } from "@/components/charts/costByBranch";
import { DataTable } from "@/components/ui/dataTable";
import { ordersInProgress } from "@/components/columns/ordersInProgress";
import { groupedOrdersByVehicle } from "@/components/columns/groupedOrdersByVehicle";
import groupOrdersByVehicle from "@/lib/utils/groupedFunctions";

export default async function DashboardPage() {
  const [company] = await fetchServerSide<Company[]>(
    `/company?orders=vehicle,workshop,branch&vehicles=driver&workshops=orders`
  );
  const { vehicles, orders, workshops } = company;

  const enrichedOrders = orders.map((item) => {
    const date = new Date(item.startDate);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    const vehiclePlate = item.vehicle.plate;
    const branchName = item.branch.name;
    const workshopName = item.workshop.name;
    const vehicleBrand = item.vehicle.brand;
    const vehicleModel = item.vehicle.model;
    const driverName = vehicles.find((v: Vehicle) => v.id == item.vehicleId)
      ?.driver.name;
    const durationDiff =
      item.endDate != null
        ? Math.floor(
            (new Date(item.endDate).getTime() - date.getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null;

    return {
      ...item,
      month,
      branchName,
      workshopName,
      driverName,
      vehiclePlate,
      vehicleBrand,
      vehicleModel,
      durationDiff,
    };
  });

  const df = new dfd.DataFrame(enrichedOrders);

  const dashboardData = {
    totalVehicles: vehicles.length,
    vehiclesInMaintenance: vehicles.filter(
      (v: Vehicle) => v.status === "MAINTENANCE"
    ).length,
    pendingOrders: orders.filter((o: Order) => !o.endDate).length,
    recentOrders: orders
      .filter((o) => !!o.startDate)
      .sort((o1, o2) => {
        const date1 = new Date(o1.startDate).getTime();
        const date2 = new Date(o2.startDate).getTime();
        return date2 - date1;
      })
      .slice(0, 5),
    monthlyExpenses: Array.from({ length: 5 }).map((_, index) => {
      const now = new Date();
      const targetDate = new Date(now.getFullYear(), now.getMonth() - index, 1);

      const total = orders
        .filter((order: Order) => {
          const orderDate = new Date(order.startDate);
          return (
            orderDate.getMonth() === targetDate.getMonth() &&
            orderDate.getFullYear() === targetDate.getFullYear()
          );
        })
        .reduce((acc: number, order: Order) => acc + order.totalCost, 0);

      return {
        month: targetDate.toLocaleString("pt-BR", { month: "short" }),
        value: total,
      };
    }),
    fleetStatus: {
      AVAILABLE: vehicles.filter((v: Vehicle) => v.status === "AVAILABLE")
        .length,
      UNAVAILABLE: vehicles.filter((v: Vehicle) => v.status === "UNAVAILABLE")
        .length,
      MAINTENANCE: vehicles.filter((v: Vehicle) => v.status === "MAINTENANCE")
        .length,
    },
    orderTypes: {
      PREVENTIVE: orders.filter((o: Order) => o.type === "PREVENTIVE").length,
      CORRECTIVE: orders.filter((o: Order) => o.type === "CORRECTIVE").length,
      PERIODIC: orders.filter((o: Order) => o.type === "PERIODIC").length,
    },
    topWorkshops: workshops
      .sort((a: Workshop, b: Workshop) => a.orders.length - b.orders.length)
      .slice(0, 5),
    _orderGroupedByYearMonth: df
      .groupby(["month"])
      .agg({
        totalCost: "sum", // custo_total
        id: "count", // quantidade_manutencoes
      })
      .rename({
        totalCost_sum: "cost",
        id_count: "services",
      })
      .sortValues("month"),
    _orderGroupedByType: df
      .groupby(["type"])
      .agg({
        totalCost: "sum",
        id: "count",
        durationDiff: "mean",
      })
      .rename({
        totalCost_sum: "totalCost",
        id_count: "quantity",
        durationDiff_mean: "avgDuration",
      }),
    _costByStatus: df
      .groupby(["status"])
      .agg({
        totalCost: "sum",
        id: "count",
      })
      .rename({
        totalCost_sum: "cost",
        id_count: "services",
        durationDiff_mean: "avgDuration",
      }),
    _costByBranch: df
      .groupby(["branchName", "branchId"])
      .agg({
        totalCost: "sum",
        id: "count",
      })
      .rename({
        totalCost_sum: "totalCost",
        id_count: "services",
      })
      .sortValues("totalCost", { ascending: false }),
    _inProgress: df
      .loc({
        rows: df["status"].eq("IN_PROGRESS"),
        columns: [
          "vehiclePlate",
          "description",
          "startDate",
          "totalCost",
          "workshopName",
        ],
      })
      .sortValues("startDate", { ascending: true }),
    _ordersByVehicle: groupOrdersByVehicle(enrichedOrders),
  };

  // Formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Visão geral da sua frota e manutenções
          </p>
        </header>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">
                Total de Veículos
              </h2>
              <Car className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {dashboardData.totalVehicles}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">Diponíveis</h2>
              <KeyRound className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-2xl font-bold">
                {dashboardData.fleetStatus.AVAILABLE}
              </span>
              <span className="text-2xl font-thin text-gray-400">
                {(dashboardData.fleetStatus.AVAILABLE /
                  dashboardData.totalVehicles) *
                  100}
                %
              </span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">
                Em Manutenção
              </h2>
              <Wrench className="h-4 w-4 text-amber-400" />
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-2xl font-bold">
                {dashboardData.fleetStatus.MAINTENANCE}
              </span>
              <span className="text-2xl font-thin text-gray-400">
                {(dashboardData.fleetStatus.MAINTENANCE /
                  dashboardData.totalVehicles) *
                  100}
                %
              </span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">
                Indisponíveis
              </h2>
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            </div>
            <div className="flex flex-row justify-between">
              <span className="text-2xl font-bold">
                {dashboardData.fleetStatus.UNAVAILABLE}
              </span>
              <span className="text-2xl font-thin text-gray-400">
                {(dashboardData.fleetStatus.UNAVAILABLE /
                  dashboardData.totalVehicles) *
                  100}
                %
              </span>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">
                Ordens Pendentes
              </h2>
              <ClipboardList className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <div className="text-2xl font-bold">
                {dashboardData.pendingOrders}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2 flex flex-row items-center justify-between space-y-0">
              <h2 className="text-sm font-medium text-gray-400">
                Gastos do Mês
              </h2>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold flex justify-between">
                {formatCurrency(dashboardData.monthlyExpenses[0].value)}
                <p className="text-xs text-gray-400 mt-1">
                  <span className="text-rose-400 inline-flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {(
                      (((dashboardData.monthlyExpenses[0].value || 0) -
                        (dashboardData.monthlyExpenses[1].value || 0)) /
                        (dashboardData.monthlyExpenses[1].value || 0)) *
                      100
                    ).toFixed(2)}{" "}
                  </span>{" "}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de tipos de manutenção */}
          <MaintenanceByType
            data={dfd.toJSON(dashboardData._orderGroupedByType, {
              format: "column",
            })}
          />

          {/* Gráfico de gastos mensais */}
          <MonthlyMaintenance
            chartData={dfd.toJSON(dashboardData._orderGroupedByYearMonth, {
              format: "column",
            })}
          />

          {/* Gráfico de custo de manutenção por status */}
          <CostByMaintenancyStatus
            chartData={dfd.toJSON(dashboardData._costByStatus, {
              format: "column",
            })}
          />

          {/* Gráfico de custo de manutenção por filial */}
          <CostByBranch
            chartData={dfd.toJSON(dashboardData._costByBranch, {
              format: "column",
            })}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          {/* Ordens em Andamento */}
          <DataTable
            columns={ordersInProgress}
            data={dfd.toJSON(dashboardData._inProgress, {
              format: "column",
            })}
            header="Ordens em Andamento"
          />

          {/* Ordens por Veículo */}
          <DataTable
            columns={groupedOrdersByVehicle}
            data={dashboardData._ordersByVehicle}
            header="Ordens por Veículo"
            grouped
          />

          {/* Oficinas principais */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="pb-2">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Oficinas Principais</h2>
                <Link href="/workshops">
                  <button className="text-indigo-400 hover:text-indigo-300 p-0 h-auto">
                    Ver todas
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
            <div>
              <div className="space-y-4">
                {dashboardData.topWorkshops?.map(
                  (workshop: any, index: number) => (
                    <Link
                      href={`/workshops/${workshop.id}`}
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
                                className={`w-3 h-3 ${
                                  i < Math.floor(workshop.rating)
                                    ? "text-yellow-400"
                                    : "text-gray-600"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {workshop.ordersCount} ordens
                        </p>
                      </div>
                    </Link>
                  )
                )}
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
                <p className="text-sm text-gray-400">
                  Visualize e gerencie todos os veículos
                </p>
              </div>
            </div>
          </Link>

          <Link href="/workshops">
            <div className="bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer h-full">
              <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                <Wrench className="h-10 w-10 text-indigo-400 mb-4" />
                <h3 className="font-bold text-lg mb-1">Oficinas</h3>
                <p className="text-sm text-gray-400">
                  Gerencie oficinas parceiras
                </p>
              </div>
            </div>
          </Link>

          <Link href="/orders">
            <div className="bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer h-full">
              <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                <ClipboardList className="h-10 w-10 text-indigo-400 mb-4" />
                <h3 className="font-bold text-lg mb-1">Ordens de Serviço</h3>
                <p className="text-sm text-gray-400">
                  Acompanhe todas as manutenções
                </p>
              </div>
            </div>
          </Link>

          <Link href="/reports">
            <div className="bg-gray-900 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors cursor-pointer h-full">
              <div className="p-6 flex flex-col items-center justify-center text-center h-full">
                <BarChart3 className="h-10 w-10 text-indigo-400 mb-4" />
                <h3 className="font-bold text-lg mb-1">Relatórios</h3>
                <p className="text-sm text-gray-400">
                  Análise detalhada e estatísticas
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
