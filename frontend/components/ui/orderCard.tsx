import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertCircle, Building, Calendar, Car, CheckCircle2, Clock, RotateCcw, Truck, User, Wrench } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function getStatusIcon(status: string) {
    switch (status) {
      case "Agendado":
        return <Calendar className="h-4 w-4" />
      case "Veículo Entregue":
        return <Truck className="h-4 w-4" />
      case "Em Andamento":
        return <RotateCcw className="h-4 w-4" />
      case "Concluído":
        return <CheckCircle2 className="h-4 w-4" />
      case "Cancelado":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }
  
  // Função para obter a cor do badge de status
  function getStatusColor(status: string) {
    switch (status) {
      case "Agendado":
        return "bg-blue-600 hover:bg-blue-700"
      case "Veículo Entregue":
        return "bg-purple-600 hover:bg-purple-700"
      case "Em Andamento":
        return "bg-amber-600 hover:bg-amber-700"
      case "Concluído":
        return "bg-emerald-600 hover:bg-emerald-700"
      case "Cancelado":
        return "bg-rose-600 hover:bg-rose-700"
      default:
        return "bg-gray-600 hover:bg-gray-700"
    }
  }

    // Formatar valores monetários
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value)
    }
  
    // Formatar datas
    const formatDate = (date: Date) => {
      return format(date, "dd/MM/yyyy", { locale: ptBR })
    }

function OrderCard({ order }: { order: Order }) {
  return (
    <Link href={`/orders/${order.id}`} key={order.id}>
                      <div className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors border rounded-2xl mb-1">
                        <div className="p-0">
                          <div className="p-4 md:p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-md ${getStatusColor(order.status)} mt-1`}>{getStatusIcon(order.status)}</div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-lg">Ordem #{order.id}</h3>
                                    <div className={`px-2 py-0.5 rounded-2xl ${getStatusColor(order.status)}`}>{order.status}</div>
                                  </div>
                                  <p className="text-gray-400">{order.description}</p>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-2">
                                    <div className="flex items-center">
                                      <Car className="h-4 w-4 mr-1 text-indigo-400" />
                                      <span>
                                        {order.vehicle.plate} - {order.vehicle.brand} {order.vehicle.model}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <User className="h-4 w-4 mr-1 text-indigo-400" />
                                      <span>{order.vehicle.driver}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Building className="h-4 w-4 mr-1 text-indigo-400" />
                                      <span>{order.filial}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Wrench className="h-4 w-4 mr-1 text-indigo-400" />
                                      <span>{order.workshop.name}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1 md:min-w-[150px]">
                                <div className="text-lg font-semibold text-emerald-400">
                                  {formatCurrency(order.cost)}
                                </div>
                                <div className="flex items-center text-sm text-gray-400">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(order.serviceDate)}
                                </div>
                                <div className="text-xs text-gray-500">Criado em: {formatDate(order.createdAt)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
  )
}

export default OrderCard