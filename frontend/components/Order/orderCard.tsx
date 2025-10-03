import type { Order, Vehicle } from "@/types/types"
import { Building, Calendar, Car, Wrench, CheckCircle } from "lucide-react"
import Link from "next/link"
import { StatusBadge } from "../ui/statusBadge"
import { formatCurrency, formatDate } from "@/lib/utils/formatFunctions"

function OrderCard({ order, vehicle }: { order: Order; vehicle: Vehicle }) {
  return (
    <Link href={`/orders/${order.id}`} key={order.id}>
      <div className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors border rounded-2xl mb-1">
        <div className="p-0">
          <div className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={order.status} type="orderStatus" />
                    <h3 className="font-medium text-lg">Ordem #{order.id}</h3>
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
                      <Building className="h-4 w-4 mr-1 text-indigo-400" />
                      <span>{order.branch?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Wrench className="h-4 w-4 mr-1 text-indigo-400" />
                      <span>{order?.workshop?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 md:min-w-[150px]">
                <div className="text-lg font-semibold text-emerald-400">{formatCurrency(order.totalCost)}</div>
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(order.createdAt)}
                </div>
                {order.endDate && (
                  <div className="flex items-center text-xs text-emerald-400">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Concluído: {formatDate(order.endDate)}
                  </div>
                )}
                <div className="text-xs text-gray-500">Criado: {formatDate(order.createdAt)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default OrderCard
