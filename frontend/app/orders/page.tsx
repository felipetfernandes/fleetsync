"use client";

import { Search, PlusCircle } from "lucide-react";
import Input from "@/components/ui/input";
import OrderCard from "@/components/Order/orderCard";
import OrderForm from "@/components/Order/orderForm";
import { useEffect, useState } from "react";
import { Order } from "@/types/types";
import { fetchClientSide } from "@/lib/utils/fetchClientSide";

export default function OrdersPage() {
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await fetchClientSide<Order[]>("GET",`/orders`);
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Ordens de Serviço</h1>
            <p className="text-gray-400 mt-1">
              Gerencie e acompanhe todas as ordens de manutenção
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-3.5 h-4 w-4 text-gray-500" />
              <Input className="pl-10" placeholder="Buscar ordens..." />
            </div>
          </div>
          <button
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm"
            onClick={() => setShowForm(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Orden
          </button>
        </header>
        {showForm && (
          <OrderForm
            onCancel={() => setShowForm(false)}
            onSubmit={() => setShowForm(false)}
          />
        )}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-800">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-white">
                Nenhuma ordem encontrada
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Tente ajustar seus filtros ou criar uma nova ordem de serviço.
              </p>
              <button className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Orden
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                return (
                  <OrderCard
                    key={order.id}
                    order={order}
                    statusInfo={{ icon: "", color: "" }}
                    vehicle={order.vehicle}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
