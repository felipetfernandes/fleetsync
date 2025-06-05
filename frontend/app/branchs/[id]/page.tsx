"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Car,
  Wrench,
  ClipboardList,
  BarChart3,
  TrendingUp,
  Calendar,
  ArrowRight,
  UserCircle,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Branch, Order, User, Vehicle, Workshop } from "@/types/types";
import {
  formatCurrency,
  formatDate,
  formatShortDate,
} from "@/lib/utils/formatFunctions";
import { StatusBadge } from "@/components/ui/statusBadge";
import { OrderStatus, UserRole, VehicleStatus } from "@/types/enums";
import { fetchClientSide } from "@/lib/utils/fetchClientSide";
import Link from "next/link";

function getStatusInfo(status: string) {
  switch (status) {
    case "Agendado":
      return { icon: <Calendar className="h-4 w-4" />, color: "bg-blue-600" };
    case "Em Andamento":
      return {
        icon: <RotateCcw className="h-4 w-4" />,
        color: "bg-amber-600",
      };
    case "Concluído":
      return {
        icon: <CheckCircle2 className="h-4 w-4" />,
        color: "bg-emerald-600",
      };
    case "Cancelado":
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        color: "bg-rose-600",
      };
    default:
      return { icon: <Clock className="h-4 w-4" />, color: "bg-gray-600" };
  }
}

export default function BranchDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const branchId = params.id;
  const [branch, setBranch] = useState<Branch | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        setLoading(true);
        // Buscar dados da filial
        const branchData = await fetchClientSide<Branch>(
          "GET",
          `/branches/${branchId}`
        );
        setBranch(branchData);

        // Buscar veículos da filial
        const vehiclesData = await fetchClientSide<Vehicle[]>(
          "GET",
          `/branches/${branchId}/vehicles`
        );
        setVehicles(vehiclesData);

        // Buscar ordens de serviço relacionadas à filial
        const ordersData = await fetchClientSide<Order[]>(
          "GET",
          `/branches/${branchId}/orders`
        );
        setOrders(ordersData);

        // Buscar oficinas parceiras da filial
        const workshopsData = await fetchClientSide<Workshop[]>(
          "GET",
          `/branches/${branchId}/workshops`
        );
        setWorkshops(workshopsData);

        // Buscar usuários da filial
        const usersData = await fetchClientSide<User[]>(
          "GET",
          `/branches/${branchId}/users`
        );
        setUsers(usersData);

        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados da filial:", error);
        setLoading(false);
      }
    };

    fetchBranchData();
  }, [branchId]);

  const handleDeleteBranch = async () => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta filial?\nEsta ação é irreversível."
    );

    if (confirmDelete) {
      try {
        await fetchClientSide<Response>("DELETE", `/branches/${branchId}`);
        router.push("/branch");
      } catch (error: any) {
        console.error("Erro ao deletar filial:", error);
      }
    } else {
      console.log("Exclusão da filial cancelada.");
    }
  };

  // Calcular estatísticas da filial
  const getBranchStats = () => {
    // Estatísticas de veículos
    const vehicleStats = {
      total: vehicles.length,
      available: vehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length,
      unavailable: vehicles.filter(v => v.status === VehicleStatus.UNAVAILABLE).length,
      maintenance: vehicles.filter(v => v.status === VehicleStatus.MAINTENANCE).length,
    };

    // Estatísticas de ordens de serviço
    const orderStats = {
      total: orders.length,
      pending: orders.filter(o => o.status === OrderStatus.PENDING || o.status === OrderStatus.IN_PROGRESS).length,
      completed: orders.filter(o => o.status === OrderStatus.COMPLETED).length,
      cancelled: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
      totalCost: orders.reduce((acc, order) => acc + order.totalCost, 0),
    };

    // Estatísticas de usuários
    const userStats = {
      total: users.length,
      drivers: users.filter(u => u.role === UserRole.DRIVER).length,
      managers: users.filter(u => u.role === UserRole.BRANCH_MANAGER).length,
      admins: users.filter(u => u.role === UserRole.ADMIN).length,
    };

    // Estatísticas de oficinas
    const workshopStats = {
      total: workshops.length,
      activeOrders: workshops.reduce((acc, workshop) => {
        const activeOrdersCount = orders.filter(
          o => o.workshopId === workshop.id && 
          (o.status === OrderStatus.PENDING || o.status === OrderStatus.IN_PROGRESS)
        ).length;
        return acc + activeOrdersCount;
      }, 0),
    };

    return {
      vehicles: vehicleStats,
      orders: orderStats,
      users: userStats,
      workshops: workshopStats,
    };
  };

  // Calcular gastos mensais
  const getMonthlyExpenses = () => {
    const months = 5; // Últimos 5 meses
    return Array.from({ length: months }).map((_, index) => {
      const now = new Date();
      const targetDate = new Date(now.getFullYear(), now.getMonth() - index, 1);

      const total = orders
        .filter((order) => {
          const orderDate = new Date(order.startDate);
          return (
            orderDate.getMonth() === targetDate.getMonth() &&
            orderDate.getFullYear() === targetDate.getFullYear()
          );
        })
        .reduce((acc, order) => acc + order.totalCost, 0);

      return {
        month: targetDate.toLocaleString("pt-BR", { month: "short" }),
        value: total,
      };
    });
  };

  // Obter ordens recentes
  const getRecentOrders = () => {
    return orders
      .filter((o) => !!o.startDate)
      .sort((o1, o2) => {
        const date1 = new Date(o1.startDate).getTime();
        const date2 = new Date(o2.startDate).getTime();
        return date2 - date1;
      })
      .slice(0, 5);
  };

  // Obter motoristas mais ativos (com mais ordens de serviço)
  const getTopDrivers = () => {
    const driverOrders = new Map();
    
    orders.forEach(order => {
      if (order.vehicle && order.vehicle.driver) {
        const driverId = order.vehicle.driver.id;
        driverOrders.set(driverId, (driverOrders.get(driverId) || 0) + 1);
      }
    });
    
    const drivers = users.filter(user => user.role === UserRole.DRIVER);
    
    return drivers
      .map(driver => ({
        ...driver,
        orderCount: driverOrders.get(driver.id) || 0,
        vehicle: vehicles.find(v => v.driverId === driver.id)
      }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 5);
  };

  // Formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (loading || !branch) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4">Carregando dados da filial...</p>
        </div>
      </div>
    );
  }

  const stats = getBranchStats();
  const monthlyExpenses = getMonthlyExpenses();
  const recentOrders = getRecentOrders();
  const topDrivers = getTopDrivers();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center mb-8">
          <button
            className="mr-4 text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => router.push("/branch")}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Building2 className="mr-3 h-10 w-10 text-indigo-400" />
                Filial {branch.name}
              </h1>
            </div>
            <p className="text-gray-400 mt-1 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {branch.city}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <button className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white py-2 px-5 border rounded flex flex-row items-center justify-center">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </button>
            <button
              className="bg-rose-900 hover:bg-rose-800 text-white py-2 px-5 rounded flex flex-row items-center justify-center"
              onClick={handleDeleteBranch}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </button>
          </div>
        </header>

        <div className="bg-gray-800 border-b border-gray-700 w-full justify-start rounded-none p-0 h-auto mb-6">
          <button
            value="overview"
            onClick={(e) => setTab(e.currentTarget.value)}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-gray-950 py-3 text-gray-400 data-[state=active]:text-white p-4"
            data-state={tab === "overview" ? "active" : "inactive"}
          >
            Visão Geral
          </button>
          <button
            value="vehicles"
            onClick={(e) => setTab(e.currentTarget.value)}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-gray-950 py-3 text-gray-400 data-[state=active]:text-white p-4"
            data-state={tab === "vehicles" ? "active" : "inactive"}
          >
            Veículos
          </button>
          <button
            value="team"
            onClick={(e) => setTab(e.currentTarget.value)}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-gray-950 py-3 text-gray-400 data-[state=active]:text-white p-4"
            data-state={tab === "team" ? "active" : "inactive"}
          >
            Equipe
          </button>
          <button
            value="workshops"
            onClick={(e) => setTab(e.currentTarget.value)}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-gray-950 py-3 text-gray-400 data-[state=active]:text-white p-4"
            data-state={tab === "workshops" ? "active" : "inactive"}
          >
            Oficinas
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

        {/* Aba de Visão Geral */}
        {tab === "overview" && (
          <>
            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <h2 className="text-sm font-medium text-gray-400">
                    Total de Veículos
                  </h2>
                  <Car className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {stats.vehicles.total}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {stats.vehicles.available} disponíveis • {stats.vehicles.maintenance} em manutenção
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <h2 className="text-sm font-medium text-gray-400">
                    Ordens de Serviço
                  </h2>
                  <ClipboardList className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {stats.orders.total}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {stats.orders.pending} pendentes • {stats.orders.completed} concluídas
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <h2 className="text-sm font-medium text-gray-400">
                    Equipe
                  </h2>
                  <UserCircle className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {stats.users.total}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {stats.users.drivers} motoristas • {stats.users.managers} gerentes
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
                  <div className="text-2xl font-bold">
                    {formatCurrency(monthlyExpenses[0].value)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {monthlyExpenses[1].value > 0 ? (
                      <span className={`${monthlyExpenses[0].value > monthlyExpenses[1].value ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {monthlyExpenses[0].value > monthlyExpenses[1].value ? '+' : '-'}
                        {Math.abs(((monthlyExpenses[0].value - monthlyExpenses[1].value) / monthlyExpenses[1].value) * 100).toFixed(1)}% 
                        vs. mês anterior
                      </span>
                    ) : (
                      <span>Primeiro mês com registros</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Gráfico de status dos veículos */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div>
                  <h2 className="text-lg font-bold">Status da Frota</h2>
                  <div className="text-gray-400">
                    Distribuição dos veículos por status
                  </div>
                </div>
                <div className="mt-4">
                  <div className="space-y-4">
                    {stats.vehicles.total > 0 ? (
                      <>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                              <span className="text-sm">Disponíveis</span>
                            </div>
                            <span className="text-sm font-medium">
                              {stats.vehicles.available} ({Math.round((stats.vehicles.available / stats.vehicles.total) * 100)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{
                                width: `${(stats.vehicles.available / stats.vehicles.total) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                              <span className="text-sm">Em Manutenção</span>
                            </div>
                            <span className="text-sm font-medium">
                              {stats.vehicles.maintenance} ({Math.round((stats.vehicles.maintenance / stats.vehicles.total) * 100)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{
                                width: `${(stats.vehicles.maintenance / stats.vehicles.total) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>
                              <span className="text-sm">Indisponíveis</span>
                            </div>
                            <span className="text-sm font-medium">
                              {stats.vehicles.unavailable} ({Math.round((stats.vehicles.unavailable / stats.vehicles.total) * 100)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full">
                            <div
                              className="h-full bg-rose-500 rounded-full"
                              style={{
                                width: `${(stats.vehicles.unavailable / stats.vehicles.total) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400 text-center py-8">Nenhum veículo cadastrado nesta filial.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Gráfico de gastos mensais */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="mb-4">
                  <h2 className="text-lg font-bold">Gastos Mensais</h2>
                  <div className="text-gray-400">Custos de manutenção por mês</div>
                </div>

                <div className="h-[220px] flex items-end justify-between gap-2">
                  {(() => {
                    const maxValue = Math.max(
                      ...monthlyExpenses.map((i) => i.value)
                    );

                    return monthlyExpenses.map((item) => {
                      const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

                      return (
                        <div
                          key={item.month}
                          className="flex flex-col items-center gap-2 w-12"
                        >
                          <div
                            className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-t-md transition-all duration-200"
                            style={{ height: `${height}%` }}
                          />
                          <span className="text-xs font-medium text-center">
                            {item.month}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ordens recentes */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="pb-2">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Ordens Recentes</h2>
                    <Link href={`/branch/${branchId}/orders`}>
                      <button className="text-indigo-400 hover:text-indigo-300 p-0 h-auto">
                        Ver todas
                        <ArrowRight className="ml-1 h-4 w-4 inline" />
                      </button>
                    </Link>
                  </div>
                </div>
                <div>
                  <div className="space-y-4">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => {
                        const statusInfo = getStatusInfo(order.status);
                        return (
                          <Link href={`/orders/${order.id}`} key={order.id}>
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors">
                              <div className="flex items-start space-x-4">
                                <div className={`p-2 rounded-md ${statusInfo.color}`}>
                                  {statusInfo.icon}
                                </div>
                                <div>
                                  <h3 className="font-medium">
                                    {order.vehicle?.plate} - {order.vehicle?.model}
                                  </h3>
                                  <p className="text-sm text-gray-400">
                                    {order.type}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {order.workshop?.name} • {formatShortDate(order.startDate)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <StatusBadge
                                  status={order.status}
                                  type="orderStatus"
                                />
                                <p className="text-sm font-medium mt-1">
                                  {formatCurrency(order.totalCost)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    ) : (
                      <p className="text-gray-400 text-center py-8">Nenhuma ordem de serviço registrada para esta filial.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Motoristas principais */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="pb-2">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Motoristas Principais</h2>
                    <Link href={`/branch/${branchId}/team`}>
                      <button className="text-indigo-400 hover:text-indigo-300 p-0 h-auto">
                        Ver todos
                        <ArrowRight className="ml-1 h-4 w-4 inline" />
                      </button>
                    </Link>
                  </div>
                </div>
                <div>
                  <div className="space-y-4">
                    {topDrivers.length > 0 ? (
                      topDrivers.map((driver, index) => (
                        <Link
                          href={`/team/${driver.id}`}
                          key={driver.id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-medium">{driver.name}</h3>
                              <p className="text-sm text-gray-400">
                                {driver.vehicle ? (
                                  <>
                                    <Car className="h-3 w-3 inline mr-1" />
                                    {driver.vehicle.plate}
                                  </>
                                ) : (
                                  "Sem veículo atribuído"
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {driver.orderCount} ordens
                            </p>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-8">Nenhum motorista cadastrado nesta filial.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Aba de Veículos */}
        {tab === "vehicles" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Veículos da Filial</h2>
              <Link href="/fleet/new">
                <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Novo Veículo
                </button>
              </Link>
            </div>

            {vehicles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.map((vehicle) => (
                  <Link
                    href={`/fleet/${vehicle.plate}`}
                    key={vehicle.id}
                    className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-colors block"
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
                      <StatusBadge
                        status={vehicle.status as VehicleStatus}
                        type="vehicleStatus"
                      />
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
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                <Car className="h-12 w-12 mx-auto text-gray-600" />
                <h3 className="mt-4 text-lg font-medium text-white">
                  Nenhum veículo cadastrado
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Esta filial ainda não possui veículos cadastrados.
                </p>
                <Link href="/fleet/new">
                  <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">
                    Adicionar Veículo
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Aba de Equipe */}
        {tab === "team" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Equipe da Filial</h2>
              <Link href="/team/new">
                <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Novo Usuário
                </button>
              </Link>
            </div>

            {users.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                  <Link
                    href={`/team/${user.id}`}
                    key={user.id}
                    className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-colors block"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="bg-gray-800 rounded-full p-2 mr-3">
                          <UserCircle className="h-8 w-8 text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{user.name}</h3>
                          <div className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                            user.role === UserRole.DRIVER 
                              ? "bg-blue-900/30 text-blue-400" 
                              : user.role === UserRole.BRANCH_MANAGER
                              ? "bg-emerald-900/30 text-emerald-400"
                              : "bg-purple-900/30 text-purple-400"
                          }`}>
                            {user.role === UserRole.DRIVER 
                              ? "Motorista" 
                              : user.role === UserRole.BRANCH_MANAGER
                              ? "Gerente de Filial"
                              : "Administrador"}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-300">{user.email}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-300">{user.phone}</span>
                      </div>

                      {user.role === UserRole.DRIVER && (
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            {vehicles.find(v => v.driverId === user.id)?.plate || "Sem veículo"}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                <UserCircle className="h-12 w-12 mx-auto text-gray-600" />
                <h3 className="mt-4 text-lg font-medium text-white">
                  Nenhum usuário cadastrado
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Esta filial ainda não possui usuários cadastrados.
                </p>
                <Link href="/team/new">
                  <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">
                    Adicionar Usuário
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Aba de Oficinas */}
        {tab === "workshops" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Oficinas Parceiras</h2>
              <Link href="/workshop/new">
                <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Oficina
                </button>
              </Link>
            </div>

            {workshops.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workshops.map((workshop) => (
                  <Link
                    href={`/workshop/${workshop.id}`}
                    key={workshop.id}
                    className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-colors block"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          <Wrench className="h-5 w-5 mr-2 text-indigo-400" />
                          <h3 className="text-lg font-medium">{workshop.name}</h3>
                        </div>
                        <p className="text-gray-400 mt-1 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {workshop.address}
                        </p>
                      </div>
                      {workshop.order?.length > 0 && (
                        <div className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-3 py-0.5">
                          {workshop.order.length} veículo(s)
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-300">{workshop.phone}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-300">{workshop.email}</span>
                      </div>

                      {workshop.manager && (
                        <div className="flex items-center">
                          <UserCircle className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-300">
                            {workshop.manager}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
                <Wrench className="h-12 w-12 mx-auto text-gray-600" />
                <h3 className="mt-4 text-lg font-medium text-white">
                  Nenhuma oficina cadastrada
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  Esta filial ainda não possui oficinas parceiras cadastradas.
                </p>
                <Link href="/workshop/new">
                  <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded">
                    Adicionar Oficina
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Aba de Estatísticas */}
        {tab === "stats" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Estatísticas da Filial</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card de Resumo Financeiro */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Resumo Financeiro</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">
                      Gastos Totais com Manutenção
                    </h4>
                    <p className="text-2xl font-bold text-emerald-400">
                      {formatCurrency(stats.orders.totalCost)}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">
                      Custo Médio por Ordem
                    </h4>
                    <p className="font-medium">
                      {formatCurrency(stats.orders.total > 0 ? stats.orders.totalCost / stats.orders.total : 0)}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">
                      Custo Médio por Veículo
                    </h4>
                    <p className="font-medium">
                      {formatCurrency(stats.vehicles.total > 0 ? stats.orders.totalCost / stats.vehicles.total : 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card de Eficiência da Frota */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Eficiência da Frota</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">
                      Taxa de Disponibilidade
                    </h4>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">
                        {stats.vehicles.total > 0 ? Math.round((stats.vehicles.available / stats.vehicles.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full mt-1">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${stats.vehicles.total > 0 ? (stats.vehicles.available / stats.vehicles.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">
                      Taxa de Manutenção
                    </h4>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">
                        {stats.vehicles.total > 0 ? Math.round((stats.vehicles.maintenance / stats.vehicles.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full mt-1">
                      <div
                        className="h-full bg-amber-600 rounded-full"
                        style={{ width: `${stats.vehicles.total > 0 ? (stats.vehicles.maintenance / stats.vehicles.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">
                      Veículos por Motorista
                    </h4>
                    <p className="font-medium">
                      {stats.users.drivers > 0 
                        ? (stats.vehicles.total / stats.users.drivers).toFixed(1) 
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card de Análise de Ordens */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Análise de Ordens</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">
                      Taxa de Conclusão
                    </h4>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">
                        {stats.orders.total > 0 ? Math.round((stats.orders.completed / stats.orders.total) * 100) : 0}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full mt-1">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${stats.orders.total > 0 ? (stats.orders.completed / stats.orders.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">
                      Ordens por Veículo
                    </h4>
                    <p className="font-medium">
                      {stats.vehicles.total > 0 
                        ? (stats.orders.total / stats.vehicles.total).toFixed(1) 
                        : "N/A"}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">
                      Ordens Pendentes
                    </h4>
                    <p className="font-medium">
                      {stats.orders.pending} ({stats.orders.total > 0 ? Math.round((stats.orders.pending / stats.orders.total) * 100) : 0}%)
                    </p>
                  </div>
                </div>
              </div>

              {/* Card de Comparação com Outras Filiais */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">Comparação com Outras Filiais</h3>
                
                <div className="flex items-center justify-center h-40">
                  <p className="text-gray-400 text-center">
                    Dados comparativos entre filiais serão exibidos aqui quando houver mais filiais cadastradas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
