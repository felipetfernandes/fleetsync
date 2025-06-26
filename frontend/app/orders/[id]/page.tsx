"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, ClipboardList, CheckCircle2, Phone } from "lucide-react";
import VehicleCard from "@/components/Vehicle/vehicleCard";
import WorkshopCard from "@/components/ui/workshopCard";
import OrderFullCard from "@/components/Order/orderFullCard";
import { PageProps } from "@/.next/types/app/layout";
import { Order } from "@/types/types";
import { fetchClientSide } from "@/lib/utils/fetchClientSide";
import { useRouter } from "next/navigation";

export default function OrderDetailPage({ params }: PageProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchClientSide<Order>(
          "GET",
          `/orders/${params.id}?vehicle=driver&workshop=true&company=true`
        );
        setOrder(data);
      } catch (err) {
        console.error("Erro ao buscar ordem:", err);
        setError("Erro ao carregar os dados da ordem.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        <p>Ordem não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center mb-8">
          <button 
            onClick={() => router.back()} 
            aria-label="Voltar"
            className="mr-4 p-2 hover:bg-gray-800 rounded-md"
          >
            <ArrowLeft />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Detalhes da Ordem de Serviço
            </h1>
            <p className="text-gray-400 mt-1">Ordem #{order.id}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna principal - Informações da ordem */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <OrderFullCard order={order} />

            <VehicleCard vehicle={order.vehicle} />

            {/* TODO: implementar Histórico de Status futuramente */}
          </div>

          {/* Coluna lateral - Informações da oficina */}
          <div className="space-y-6">
            <WorkshopCard workshop={order.workshop} />
            <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div className="pb-2">
                <h2 className="text-xl font-bold">Ações</h2>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => console.log("Atualizar Status")}
                  className="flex items-center justify-center p-2 w-full rounded-md bg-indigo-600 hover:bg-indigo-700"
                  aria-label="Atualizar Status"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Atualizar Status
                </button>

                <button 
                  onClick={() => console.log("Gerar Relatório")}
                  className="flex items-center justify-center p-2 w-full bg-gray-950 border rounded-md border-gray-700 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  aria-label="Gerar Relatório"
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </button>

                <button 
                  onClick={() => console.log("Contatar Oficina")}
                  className="flex items-center justify-center p-2 w-full bg-gray-950 border rounded-md border-gray-700 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                  aria-label="Contatar Oficina"
                >
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
