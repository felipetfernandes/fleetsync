"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Car,
  Calendar,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  FileText,
  Truck,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";
import { format, set } from "date-fns";
import { ptBR } from "date-fns/locale";
import VehicleCard from "@/components/ui/vehicleCard";
import OrderCard from "@/components/ui/orderCard";
import { useEffect, useState } from "react";
import OrderForm from "@/components/orderForm";

// Função para obter o ícone do status
function getStatusInfo(startDate: string, endDate: string) {
  if (!startDate)
    return {
      icon: <Calendar className="h-4 w-4" />,
      color: "bg-blue-600 hover:bg-blue-700",
    };

  if (!endDate)
    return {
      icon: <RotateCcw className="h-4 w-4" />,
      color: "bg-amber-600 hover:bg-amber-700",
    };

  return {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-emerald-600 hover:bg-emerald-700",
  };
}

// Função para obter a cor do badge de status do veículo
function getVehicleStatusColor(status: string) {
  switch (status) {
    case "Ativo":
      return "bg-emerald-600 hover:bg-emerald-700";
    case "Manutenção":
      return "bg-amber-600 hover:bg-amber-700";
    case "Inativo":
      return "bg-rose-600 hover:bg-rose-700";
    default:
      return "bg-gray-600 hover:bg-gray-700";
  }
}

export default function VehicleDetailPage({
  params,
}: {
  params: { plate: string };
}) {
  const router = useRouter();
  const plate = decodeURIComponent(params.plate);
  const [tab, setTab] = useState("info");
  const [showForm, setShowForm] = useState(false);

  const [vehicle, setvehicle] = useState<Vehicle | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`http://localhost:3001/vehicles/${plate}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Erro ao buscar veículos");

        const data = await res.json();
        setvehicle(data);
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
        // redirecionar para login se necessário
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:3001/orders/plate/${plate}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Erro ao buscar veículos");

        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
        // redirecionar para login se necesario
      }
    };

    fetchVehicle();
    fetchOrders();
  }, []);

  // Formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Formatar datas
  const formatDate = (date: Date | string) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return format(parsedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatShortDate = (date: Date | string) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return format(parsedDate, "dd/MM/yyyy", { locale: ptBR });
  };

  // Calcular a distribuição de tipos de manutenção
  const maintenanceTypeDistribution = () => {
    const types = orders.reduce((acc: Record<string, number>, order) => {
      acc[order.type] = (acc[order.type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(types).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round(((count as number) / orders.length) * 100),
    }));
  };

  const maintenancesResume = (orders: Order[]) => {
    const today = new Date();
    const totalCost = orders.reduce((acc, order) => acc + order.totalCost, 0);
    const totalOrders = orders.length;
    const avarageCoast = totalCost / totalOrders;
    const totalDays = orders.reduce((acc, order) => {
      const startDate = new Date(order.startDate);
      const endDate = new Date(order.endDate);
      const diffInMs = endDate.getTime() - startDate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      return acc + diffInDays;
    }, 0);

    const mostRecent = orders.reduce((latest, current) => {
      return new Date(current.endDate) > new Date(latest.endDate)
        ? current
        : latest;
    });

    const diffTime = Math.abs(
      today.getTime() - new Date(mostRecent.endDate).getTime()
    );
    const daysSinceLast = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      totalCost,
      avarageCoast,
      totalDays,
      totalOrders,
      mostRecent,
      daysSinceLast,
    };
  };

  if (!vehicle || orders.length === 0) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center mb-8">
          <button
            className="mr-4 text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => router.push("/fleet")}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Car className="mr-3 h-10 w-10 text-indigo-400" />
                Veículo {vehicle.plate}
              </h1>
              <p
                className={`${getVehicleStatusColor(
                  vehicle.status
                )} px-2 py-0.5 rounded-2xl`}
              >
                {vehicle.status}
              </p>
            </div>
            <p className="text-gray-400 mt-1">
              {vehicle.brand} {vehicle.model} • {vehicle.modelYear}/
              {vehicle.manufactureYear}
            </p>
          </div>
          <div className="flex gap-2 ml-4">
            <button className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white py-2 px-5 border rounded flex flex-row items-center justify-center">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </button>
            <button className="bg-rose-900 hover:bg-rose-800 text-white py-2 px-5 rounded flex flex-row items-center justify-center">
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
            <button
              value="documents"
              onClick={(e) => setTab(e.currentTarget.value)}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-gray-950 py-3 text-gray-400 data-[state=active]:text-white p-4"
              data-state={tab === "documents" ? "active" : "inactive"}
            >
              Documentos
            </button>
          </div>

          {/* Aba de Informações */}
          {tab === "info" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <VehicleCard vehicle={vehicle} />

                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">Dados de Aquisição</h2>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Data de Aquisição
                        </h3>
                        <p className="font-medium">
                          {formatDate(vehicle.purchaseDate)}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Tipo de Aquisição
                        </h3>
                        <p className="font-medium">{vehicle.purchaseType}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Valor
                        </h3>
                        <p className="font-medium">{vehicle.purchaseValue}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Fornecedor
                        </h3>
                        <p className="font-medium">{vehicle.seller}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">Motorista Responsável</h2>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Nome
                        </h3>
                        <p className="font-medium">{vehicle.driver.name}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          CNH
                        </h3>
                        <p className="font-medium">
                          {vehicle.driver.licenseNumber}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Categoria
                        </h3>
                        <p className="font-medium">
                          {vehicle.driver.licenseCategory}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Telefone
                        </h3>
                        <p className="font-medium">{vehicle.driver.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">Resumo de Manutenções</h2>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Total Gasto em Manutenções
                        </h3>
                        <p className="font-medium text-lg text-emerald-400">
                          {formatCurrency(maintenancesResume(orders).totalCost)}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Quantidade de Manutenções
                        </h3>
                        <p className="font-medium">
                          {maintenancesResume(orders).totalOrders}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Dias em Manutenção
                        </h3>
                        <p className="font-medium">
                          {maintenancesResume(orders).totalDays}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Última Manutenção
                        </h3>
                        <div className="flex items-center">
                          <p className="font-medium mr-2">
                            {formatShortDate(
                              maintenancesResume(orders).mostRecent.endDate
                            )}
                          </p>
                          <p className="text-xs">
                            {maintenancesResume(orders).daysSinceLast} dias
                            atrás
                          </p>
                        </div>
                      </div>
                      {/*
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Disponibilidade
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">
                              {vehicle.stats.availability}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-800">
                            <div className="h-full bg-emerald-600 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba de Ordens de Serviço */}
          {tab === "orders" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  Histórico de Ordens de Serviço
                </h2>
                <button
                  className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm"
                  onClick={() => setShowForm(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nova Orden
                </button>
              </div>

              {showForm && (
                <OrderForm
                  onCancel={() => setShowForm(false)}
                  onSubmit={() => setShowForm(false)}
                />
              )}

              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="bg-gray-900 border-gray-800">
                    <div className="p-8 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
                        <ClipboardList className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-white">
                        Nenhuma ordem de serviço
                      </h3>
                      <p className="mt-2 text-sm text-gray-400">
                        Este veículo ainda não possui ordens de serviço.
                      </p>
                      <button className="mt-6 bg-indigo-600 hover:bg-indigo-700">
                        Criar Nova Ordem
                      </button>
                    </div>
                  </div>
                ) : (
                  orders.map((order: Order) => {
                    const statusInfo = getStatusInfo(
                      order.startDate,
                      order.endDate
                    );

                    return (
                      <OrderCard
                        key={order.id}
                        statusInfo={statusInfo}
                        order={order}
                        vehicle={vehicle}
                      />
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Aba de Estatísticas */}
          {tab === "stats" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">Custos de Manutenção</h2>
                  </div>
                  <div>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">Total Gasto</p>
                          <p className="text-2xl font-bold text-emerald-400">
                            {formatCurrency(
                              maintenancesResume(orders).totalCost
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">
                            Custo Médio por Manutenção
                          </p>
                          <p className="text-xl font-bold">
                            {formatCurrency(
                              maintenancesResume(orders).avarageCoast
                            )}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-3">
                          Distribuição por Tipo
                        </h3>
                        <div className="space-y-4">
                          {maintenanceTypeDistribution().map((item, index) => {
                            const colors = [
                              "bg-indigo-500",
                              "bg-emerald-500",
                              "bg-amber-500",
                            ];
                            return (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div
                                      className={`w-3 h-3 rounded-full ${
                                        colors[index % colors.length]
                                      } mr-2`}
                                    ></div>
                                    <span className="text-sm">tipo</span>
                                  </div>
                                  <span className="text-sm font-medium">
                                    {item.count} ({index + 50}%)
                                  </span>
                                </div>
                                <div className="h-2 bg-gray-800">
                                  <div
                                    className={`h-full ${
                                      colors[index % colors.length]
                                    } rounded-full`}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">
                      Métricas de Desempenho
                    </h2>
                  </div>
                  <div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        {/*<div className="bg-gray-800 rounded-lg p-4">
                          <p className="text-sm text-gray-400">
                            Disponibilidade
                          </p>
                          <p className="text-2xl font-bold">
                            {vehicle.stats.availability}%
                          </p>
                          <div className="h-1 mt-2 bg-gray-700">
                            <div className="h-full bg-emerald-600 rounded-full"></div>
                          </div>
                        </div>*/}

                        <div className="bg-gray-800 rounded-lg p-4">
                          <p className="text-sm text-gray-400">
                            Dias em Manutenção
                          </p>
                          <p className="text-2xl font-bold">
                            {maintenancesResume(orders).totalDays}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Total acumulado
                          </p>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-4">
                          <p className="text-sm text-gray-400">Quilometragem</p>
                          <p className="text-2xl font-bold">
                            {vehicle.mileageCurrent.toLocaleString("pt-BR")} km
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Atual</p>
                        </div>

                        {/*<div className="bg-gray-800 rounded-lg p-4">
                          <p className="text-sm text-gray-400">Consumo Médio</p>
                          <p className="text-2xl font-bold">
                            {vehicle.stats.fuelConsumption} km/l
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Média dos últimos 3 meses
                          </p>
                        </div>*/}
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-3">
                          Última Manutenção
                        </h3>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {formatDate(
                                  maintenancesResume(orders).mostRecent.endDate
                                )}
                              </p>
                              <p className="text-sm text-gray-400 mt-1">
                                {maintenancesResume(orders).daysSinceLast} dias
                                atrás
                              </p>
                            </div>
                            <p className="bg-emerald-600 px-2 py-0.5 rounded-2xl">
                              Concluído
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba de Documentos */}
          {tab === "documents" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-indigo-400" />
                      Seguro
                    </h2>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Seguradora
                        </h3>
                        <p className="font-medium">{vehicle.insuranceProvider}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Apólice
                        </h3>
                        <p className="font-medium">{vehicle.insurancePolicy}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Validade
                        </h3>
                        <p className="font-medium">{formatDate(vehicle.insuranceExpires)}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Valor
                        </h3>
                        <p className="font-medium">{vehicle.insuranceValue}</p>
                      </div>

                      <button className="flex flex-row items-center justify-center p-2 rounded text-sm w-full bg-indigo-600 hover:bg-indigo-700">
                        <FileText className="mr-2 h-4 w-4" />
                        Ver Documento
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <div className="text-xl font-bold flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-indigo-400" />
                      IPVA
                    </div>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Status
                        </h3>
                        <p
                          className={`${
                            new Date() < new Date(vehicle.ipvaDueDate) ? "bg-emerald-600" : "bg-rose-600"
                          } w-fit py-0.5 px-3 rounded-2xl`}
                        >
                          {new Date() < new Date(vehicle.ipvaDueDate) ? "Pago" : "Pendente"}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Valor
                        </h3>
                        <p className="font-medium">{formatCurrency(vehicle.ipvaValue)}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Vencimento
                        </h3>
                        <p className="font-medium">{formatDate(vehicle.ipvaDueDate)}</p>
                      </div>

                      <button className="flex flex-row items-center justify-center p-2 rounded text-sm w-full bg-indigo-600 hover:bg-indigo-700">
                        <FileText className="mr-2 h-4 w-4" />
                        Ver Documento
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold flex items-center">
                      <FileText className="mr-2 h-5 w-5 text-indigo-400" />
                      Licenciamento
                    </h2>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Status
                        </h3>
                        <p
                          className={`${
                            new Date() < new Date(vehicle.licenseDueDate) ? "bg-emerald-600" : "bg-rose-600"
                          } w-fit py-0.5 px-3 rounded-2xl`}
                        >
                          {new Date() < new Date(vehicle.licenseDueDate) ? "Pago" : "Pendente"}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Valor
                        </h3>
                        <p className="font-medium">{formatCurrency(vehicle.licenseValue)}</p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">
                          Vencimento
                        </h3>
                        <p className="font-medium">{formatDate(vehicle.licenseDueDate)}</p>
                      </div>

                      <button className="flex flex-row items-center justify-center p-2 rounded text-sm w-full bg-indigo-600 hover:bg-indigo-700">
                        <FileText className="mr-2 h-4 w-4" />
                        Ver Documento
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
