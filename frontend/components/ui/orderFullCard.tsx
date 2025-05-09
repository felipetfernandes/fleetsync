import { Building, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import React from "react";

// Função para obter a cor do badge de status
function getStatusColor(status: string) {
  switch (status) {
    case "Agendado":
      return "bg-blue-600 hover:bg-blue-700";
    case "Veículo Entregue":
      return "bg-purple-600 hover:bg-purple-700";
    case "Em Andamento":
      return "bg-amber-600 hover:bg-amber-700";
    case "Concluído":
      return "bg-emerald-600 hover:bg-emerald-700";
    case "Cancelado":
      return "bg-rose-600 hover:bg-rose-700";
    default:
      return "bg-gray-600 hover:bg-gray-700";
  }
}

// Formatar datas
const formatDate = (date: Date) => {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

function OrderFullCard({  order, formatDateTime }: { order: Order; formatDateTime: (date: Date) => string }) {
  // Formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
      <div className="pb-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Informações da Ordem</h2>
          <p
            className={`${getStatusColor(
              order.status
            )} rounded-2xl text-xs px-2 py-0.5`}
          >
            {order.status}
          </p>
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
              <p>{formatDate(order.serviceDate)}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Custo</h3>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-emerald-400" />
              <p className="text-lg font-semibold text-emerald-400">
                {formatCurrency(order.cost)}
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
            <p>{order.enterprise.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderFullCard;
