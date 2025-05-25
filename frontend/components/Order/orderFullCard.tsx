import { Building, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React from "react";
import { Order } from "@/types/types";
import { formatCurrency, formatDateTime } from "@/lib/utils/formatFunctions";
import { StatusBadge } from "../ui/statusBadge";

function OrderFullCard({  order }: { order: Order }) {
  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
      <div className="pb-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Informações da Ordem</h2>
          <StatusBadge status={order.status} type="orderStatus" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">
            Tipo de Serviço
          </h3>
          <p className="text-lg font-medium">{order.type}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Descrição</h3>
          <p className="text-base">{order.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">
              Data do Serviço
            </h3>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-indigo-400" />
              <p>{formatDateTime(order.startDate)}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Custo</h3>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-emerald-400" />
              <p className="text-lg font-semibold text-emerald-400">
                {formatCurrency(order.totalCost)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">
              Criado em
            </h3>
            <p>{formatDateTime(order.createdAt)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">
              Última atualização
            </h3>
            <p>{formatDateTime(order.updatedAt)}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Empresa</h3>
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-2 text-indigo-400" />
            <p>{order.company.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderFullCard;
