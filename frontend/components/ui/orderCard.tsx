import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertCircle, Building, Calendar, Car, CheckCircle2, Clock, RotateCcw, Truck, User, Wrench } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

    // Formatar valores monetários
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value)
    }
  
    // Formatar datas
const formatDate = (date: Date | string) => {
      const parsedDate = typeof date === "string" ? new Date(date) : date;
      return format(parsedDate, "dd/MM/yyyy", { locale: ptBR })
    }

function OrderCard({ order, vehicle, statusInfo }: { order: Order; vehicle: Vehicle; statusInfo: { icon: React.ReactNode; color: string } }) {
  return (
    <Link href={`/orders/${order.id}`} key={order.id}>
                      <div className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors border rounded-2xl mb-1">
                        <div className="p-0">
                          <div className="p-4 md:p-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <div className={`p-2 rounded-md ${statusInfo.color} mt-1`}>{statusInfo.icon}</div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-lg">Ordem #{order.id}</h3>
                                    <div className={`px-2 py-0.5 rounded-2xl ${statusInfo.color}`}>{vehicle.status}</div>
                                  </div>
                                  <p className="text-gray-400">{order.description}</p>
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mt-2">
                                    <div className="flex items-center">
                                      <Car className="h-4 w-4 mr-1 text-indigo-400" />
                                      <span>
                                        {vehicle.plate} - {vehicle.brand} {vehicle.model}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <User className="h-4 w-4 mr-1 text-indigo-400" />
                                      <span>{vehicle.driver.name}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Building className="h-4 w-4 mr-1 text-indigo-400" />
                                      <span>{order.branchId}</span>
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
                                  {formatCurrency(order.totalCost)}
                                </div>
                                <div className="flex items-center text-sm text-gray-400">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(order.createdAt)}
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