"use client"

import React, { useEffect, useState } from "react";
import { ArrowLeft, ClipboardList, CheckCircle2, Phone } from "lucide-react";
import VehicleCard from "@/components/Vehicle/vehicleCard";
import WorkshopCard from "@/components/ui/workshopCard";
import OrderFullCard from "@/components/Order/orderFullCard";
import { PageProps } from "@/.next/types/app/layout";
import { Order } from "@/types/types";

export default async function OrderDetailPage({ params }: PageProps) {
const [order, setOrder] = useState({} as Order);

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(`${BASE_URL}/orders/${params.id}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erro ao buscar ordens");

      const data = await res.json();
      setOrder(data);
    };
    fetchOrders();
}, []);
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center mb-8">
          <button onClick={() => window.history.back()}>
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

            {/*<div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
              <div className="pb-2">
                <h2 className="text-xl font-bold">Histórico de Status</h2>
              </div>
            </div>*/}
          </div>

          {/* Coluna lateral - Informações da oficina */}
          <div className="space-y-6">
            <WorkshopCard workshop={order.workshop} />
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
