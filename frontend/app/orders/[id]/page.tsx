"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Truck,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import VehicleCard from "@/components/Vehicle/vehicleCard";
import WorkshopCard from "@/components/ui/workshopCard";
import OrderFullCard from "@/components/Order/orderFullCard";

// Dados de exemplo para uma ordem específica
const mockOrder = {
  id: "ord123456",
  description:
    "Revisão completa do motor e substituição de componentes desgastados",
  type: "Manutenção Preventiva",
  cost: 1250.75,
  serviceDate: new Date("2025-05-15T10:00:00"),
  status: "Em Andamento",
  createdAt: new Date("2025-05-01T14:30:00"),
  updatedAt: new Date("2025-05-10T09:15:00"),

  // Dados do veículo relacionado
  vehicle: {
    id: "v123",
    plate: "ABC1234",
    model: "Corolla",
    brand: "Toyota",
    yearModelo: "2022",
    yearFabricacao: "2021",
    color: "Preto",
    renavam: "12345678901",
    chassi: "9BRBL9BF1K0123456",
    filial: "São Paulo",
    status: "Manutenção",
  },

  // Dados da oficina relacionada
  workshop: {
    id: "w123",
    name: "Auto Center Express",
    cnpj: "12.345.678/0001-90",
    email: "contato@autocenterexpress.com",
    telephone: "(11) 3456-7890",
    adress: "Av. Paulista, 1000, São Paulo - SP",
  },

  // Dados da empresa
  enterprise: {
    id: "e123",
    name: "Transportes Brasil Ltda.",
  },

  // Histórico de status
  statusHistory: [
    {
      id: "sh1",
      status: "Agendado",
      date: new Date("2025-05-01T14:30:00"),
      description: "Ordem de serviço criada e agendada",
    },
    {
      id: "sh2",
      status: "Veículo Entregue",
      date: new Date("2025-05-15T08:45:00"),
      description: "Veículo entregue na oficina",
    },
    {
      id: "sh3",
      status: "Em Andamento",
      date: new Date("2025-05-15T10:30:00"),
      description: "Início dos trabalhos de manutenção",
    },
  ],
};

// Função para obter o ícone do status
function getStatusIcon(status: string) {
  switch (status) {
    case "Agendado":
      return <Calendar className="h-4 w-4" />;
    case "Veículo Entregue":
      return <Truck className="h-4 w-4" />;
    case "Em Andamento":
      return <RotateCcw className="h-4 w-4" />;
    case "Concluído":
      return <CheckCircle2 className="h-4 w-4" />;
    case "Cancelado":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
}

export default function OrderDetailPage() {
  const router = useRouter();
  const formatDateTime = (date: Date) => {
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center mb-8">
          <button
            className="mr-4 text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={() => router.push("/orders")}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Detalhes da Ordem de Serviço
            </h1>
            <p className="text-gray-400 mt-1">Ordem #{mockOrder.id}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal - Informações da ordem */}
          <div className="lg:col-span-2 space-y-6">
            <OrderFullCard order={mockOrder} formatDateTime={formatDateTime} />

            <VehicleCard vehicle={mockOrder.vehicle} />

            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div className="pb-2">
                <h2 className="text-xl font-bold">Histórico de Status</h2>
              </div>

              <div className="space-y-4">
                {mockOrder.statusHistory.map((item, index) => (
                  <div key={item.id} className="relative pl-6">
                    {index !== mockOrder.statusHistory.length - 1 && (
                      <div className="absolute left-[9px] top-6 bottom-0 w-0.5 bg-gray-800"></div>
                    )}
                    <div className="flex items-start">
                      <div className="absolute left-0 top-1 rounded-full bg-gray-800 p-1">
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className="font-medium">{item.status}</h3>
                          <span className="mx-2 text-gray-600">•</span>
                          <p className="text-sm text-gray-400">
                            {formatDateTime(item.date)}
                          </p>
                        </div>
                        <p className="text-sm mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna lateral - Informações da oficina */}
          <div className="space-y-6">
            <WorkshopCard workshop={mockOrder.workshop} />
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div className="pb-2">
                <h2 className="text-xl font-bold">Ações</h2>
              </div>
              <div className="space-y-3">
                <button className="flex items-center justify-center p-2 w-full rounded-md bg-indigo-600 hover:bg-indigo-700">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Atualizar Status
                </button>

                <button className="flex items-center justify-center p-2 w-full bg-gray-950 border rounded-md border-gray-700 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </button>

                <button className="flex items-center justify-center p-2 w-full bg-gray-950 border rounded-md border-gray-700 text-sm text-gray-300 hover:bg-gray-800 hover:text-white">
                  <Phone className="mr-2 h-4 w-4" />
                  Contatar Oficina
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
