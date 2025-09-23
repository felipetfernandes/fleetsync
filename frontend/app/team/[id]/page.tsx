"use client"

import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  UserCircle,
  ClipboardList,
  BarChart3,
  Edit,
  Trash2,
  PlusCircle,
  Mail,
  Phone,
  Car,
  Calendar,
  Building2,
  MapPin,
} from "lucide-react"
import { useEffect, useState } from "react"
import type { User } from "@/types/types"
import { formatCurrency, formatDate, formatShortDate } from "@/lib/utils/formatFunctions"
import type { UserRole } from "@/types/enums"
import { fetchClientSide } from "@/lib/utils/fetchClientSide"
import OrderCard from "@/components/Order/orderCard"
import OrderForm from "@/components/Order/orderForm"
import Link from "next/link"

// Função para obter o nome da função em português
const getRoleName = (role: UserRole): string => {
  const roleNames = {
    ADMIN: "Administrador",
    DRIVER: "Motorista",
    WORKSHOP_MANAGER: "Gerente de Oficina",
    BRANCH_MANAGER: "Gerente de Filial",
  }

  return roleNames[role] || role
}

// Função para obter a cor do badge da função
const getRoleColor = (role: UserRole): string => {
  const roleColors = {
    ADMIN: "bg-purple-900/30 text-purple-400",
    DRIVER: "bg-blue-900/30 text-blue-400",
    WORKSHOP_MANAGER: "bg-amber-900/30 text-amber-400",
    BRANCH_MANAGER: "bg-emerald-900/30 text-emerald-400",
  }

  return roleColors[role] || "bg-gray-900/30 text-gray-400"
}

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const userId = params.id
  const [tab, setTab] = useState("info")
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchClientSide<User>("GET", `/users/id/${userId}?vehicle=orders,driver&workshop=true`)
        setUser(userData)
      } catch (error) {
        console.error("Erro ao buscar usuário:", error)
        // redirecionar para login se necessário
      }
    }

    fetchUser()
  }, [])

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este usuário?\nEsta ação é irreversível.")

    if (confirmDelete) {
      try {
        await fetchClientSide<Response>("DELETE", `/users/${userId}`)
        router.push("/team")
      } catch (error: any) {
        console.error("Erro ao deletar usuário:", error)
        alert("Erro ao excluir usuário: " + (error.message || "Erro desconhecido"))
      }
    } else {
      console.log("Exclusão do usuário cancelada.")
    }
  }

  // Funções de cálculo de estatísticas (adaptadas de VehicleDetailPage)
  const maintenanceTypeDistribution = () => {
    if (user && user.vehicle) {
      const types = user.vehicle.orders.reduce((acc: Record<string, number>, order) => {
        acc[order.type] = (acc[order.type] || 0) + 1
        return acc
      }, {})

      return Object.entries(types).map(([type, count]) => ({
        type,
        count,
        percentage:
          user.vehicle!.orders.length > 0 ? Math.round(((count as number) / user.vehicle!.orders.length) * 100) : 0,
      }))
    }

    return []
  }

  const maintenancesResume = () => {
    const today = new Date()

    if (user && user.vehicle) {
      const totalCost = user?.vehicle?.orders.reduce((acc, order) => acc + order.totalCost, 0)
      const totalOrders = user?.vehicle?.orders.length
      const averageCost = totalOrders > 0 ? totalCost / totalOrders : 0
      const totalDays = user?.vehicle?.orders.reduce((acc, order) => {
        if (!order.endDate) return acc // Ignorar ordens sem data final
        const startDate = new Date(order.startDate)
        const endDate = new Date(order.endDate)
        const diffInMs = endDate.getTime() - startDate.getTime()
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
        return acc + diffInDays
      }, 0)

      const mostRecent =
        user.vehicle.orders.length > 0
          ? user?.vehicle?.orders.reduce((latest, current) => {
              const latestDate = latest.endDate ? new Date(latest.endDate) : new Date(0)
              const currentDate = current.endDate ? new Date(current.endDate) : new Date(0)
              return currentDate > latestDate ? current : latest
            })
          : { endDate: undefined }

      const diffTime = mostRecent.endDate ? Math.abs(today.getTime() - new Date(mostRecent.endDate).getTime()) : 0
      const daysSinceLast = mostRecent.endDate ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0

      return {
        totalCost,
        averageCost,
        totalDays,
        totalOrders,
        mostRecent,
        daysSinceLast,
      }
    }
    return null
  }

  if (!user) {
    return <div>Carregando...</div>
  }

  const resume = maintenancesResume()
  const distribution = maintenanceTypeDistribution()

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center mb-8">
          <button
            className="mr-4 text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => router.push("/team")}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="bg-gray-800 rounded-full p-2">
                <UserCircle className="h-10 w-10 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center">{user.name}</h1>
                <div className={`inline-block px-2 py-0.5 rounded-full text-sm mt-1 ${getRoleColor(user.role)}`}>
                  {getRoleName(user.role)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Link
              href={`/team/${userId}/edit`}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white py-2 px-5 border rounded flex flex-row items-center justify-center"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
            <button
              className="bg-rose-900 hover:bg-rose-800 text-white py-2 px-5 rounded flex flex-row items-center justify-center"
              onClick={handleDeleteUser}
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
            {user.role === "DRIVER" && (
              <>
                <button
                  value="activity"
                  onClick={(e) => setTab(e.currentTarget.value)}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-gray-950 py-3 text-gray-400 data-[state=active]:text-white p-4"
                  data-state={tab === "activity" ? "active" : "inactive"}
                >
                  Atividade (Veículo)
                </button>
                <button
                  value="stats"
                  onClick={(e) => setTab(e.currentTarget.value)}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-500 data-[state=active]:bg-gray-950 py-3 text-gray-400 data-[state=active]:text-white p-4"
                  data-state={tab === "stats" ? "active" : "inactive"}
                >
                  Estatísticas (Veículo)
                </button>
              </>
            )}
          </div>

          {/* Aba de Informações */}
          {tab === "info" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card de Dados Pessoais */}
                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">Dados Pessoais</h2>
                  </div>
                  <div className="mt-4 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Nome Completo</h3>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
                      <p className="font-medium flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-400" />
                        {user.email}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Telefone</h3>
                      <p className="font-medium flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gray-400" />
                        {user.phone}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Função</h3>
                      <div className={`inline-block px-2 py-0.5 rounded-full text-sm ${getRoleColor(user.role)}`}>
                        {getRoleName(user.role)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card de Informações Adicionais (depende da função) */}
                <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                  <div>
                    <h2 className="text-xl font-bold">Informações Adicionais</h2>
                  </div>
                  <div className="mt-4 space-y-4">
                    {user.role === "DRIVER" && (
                      <>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">CNH</h3>
                          <p className="font-medium flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {user.licenseNumber} (Cat. {user.licenseCategory})
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Validade CNH</h3>
                          <p className="font-medium">
                            {user.licenseExpiration ? formatDate(user.licenseExpiration) : "Não informado"}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-1">Veículo Atribuído</h3>
                          {user.vehicle ? (
                            <Link
                              href={`/fleet/${user.vehicle.plate}`}
                              className="font-medium flex items-center text-indigo-400 hover:text-indigo-300"
                            >
                              <Car className="h-4 w-4 mr-1" />
                              {user.vehicle.plate} - {user.vehicle.brand} {user.vehicle.model}
                            </Link>
                          ) : (
                            <p className="font-medium text-gray-500">Nenhum veículo atribuído</p>
                          )}
                        </div>
                      </>
                    )}
                    {user.role === "WORKSHOP_MANAGER" && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Oficina Gerenciada</h3>
                        {user.workshop ? (
                          <Link
                            href={`/workshop/${user.workshop.id}`}
                            className="font-medium flex items-center text-indigo-400 hover:text-indigo-300"
                          >
                            <Building2 className="h-4 w-4 mr-1" />
                            {user.workshop.name}
                          </Link>
                        ) : (
                          <p className="font-medium text-gray-500">Nenhuma oficina atribuída</p>
                        )}
                      </div>
                    )}
                    {user.role === "BRANCH_MANAGER" && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Filial Gerenciada</h3>
                        {user.branch ? (
                          <p className="font-medium flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                            {user.branch.name} - {user.branch.city}
                          </p>
                        ) : (
                          <p className="font-medium text-gray-500">Nenhuma filial atribuída</p>
                        )}
                      </div>
                    )}
                    {user.role === "ADMIN" && <p className="font-medium text-gray-500">Acesso total ao sistema.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba de Atividade (Motorista) */}
          {tab === "activity" && user.role === "DRIVER" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Histórico de Ordens de Serviço (Veículo: {user.vehicle?.plate})</h2>
                {user.vehicle && (
                  <button
                    className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm"
                    onClick={() => setShowOrderForm(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Ordem
                  </button>
                )}
              </div>

              {showOrderForm && (
                <OrderForm
                  onCancel={() => setShowOrderForm(false)}
                  onSubmit={() => setShowOrderForm(false)} // Idealmente, deveria recarregar as ordens
                />
              )}

              <div className="space-y-4">
                {user?.vehicle?.orders.length === 0 ? (
                  <div className="bg-gray-900 border-gray-800">
                    <div className="p-8 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
                        <ClipboardList className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="mt-4 text-lg font-medium text-white">Nenhuma ordem de serviço</h3>
                      <p className="mt-2 text-sm text-gray-400">
                        Nenhuma ordem de serviço encontrada para o veículo atribuído a este motorista.
                      </p>
                    </div>
                  </div>
                ) : (
                  user?.vehicle?.orders.map((order) => (
                    <OrderCard key={order.id} order={order} vehicle={user.vehicle} />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Aba de Estatísticas (Motorista) */}
          {tab === "stats" && user.role === "DRIVER" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Estatísticas de Manutenção (Veículo: {user.vehicle?.plate})</h2>

              {user && user.vehicle && user.vehicle.orders.length > 0 && resume ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card de Resumo de Custos */}
                  <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                    <div>
                      <h2 className="text-xl font-bold">Resumo de Custos</h2>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Custo Total de Manutenções</h3>
                        <p className="font-medium text-lg text-emerald-400">{formatCurrency(resume.totalCost)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Custo Médio por Ordem</h3>
                        <p className="font-medium">{formatCurrency(resume.averageCost)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Total de Ordens de Serviço</h3>
                        <p className="font-medium">{resume.totalOrders}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card de Resumo Temporal */}
                  <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                    <div>
                      <h2 className="text-xl font-bold">Resumo Temporal</h2>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Total de Dias em Manutenção</h3>
                        <p className="font-medium">{resume.totalDays.toFixed(0)} dias</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-1">Última Manutenção Concluída</h3>
                        <div className="flex items-center">
                          <p className="font-medium mr-2">
                            {resume.mostRecent.endDate ? formatShortDate(resume.mostRecent.endDate) : "N/A"}
                          </p>
                          {resume.mostRecent.endDate && <p className="text-xs">({resume.daysSinceLast} dias atrás)</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card de Distribuição de Serviços */}
                  <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl col-span-1 md:col-span-2">
                    <div>
                      <h2 className="text-xl font-bold">Distribuição por Tipo de Serviço</h2>
                    </div>
                    <div className="mt-4">
                      <div className="space-y-4">
                        {distribution.map((item) => (
                          <div key={item.type} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{item.type}</span>
                              <span className="text-sm">
                                {item.count} ({item.percentage}%)
                              </span>
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
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-900 border-gray-800">
                  <div className="p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
                      <BarChart3 className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-white">Sem dados para estatísticas</h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Não há ordens de serviço suficientes para gerar estatísticas para o veículo deste motorista.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
