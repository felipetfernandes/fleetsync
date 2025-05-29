"use client";

import VehicleCard from "@/components/Vehicle/vehicleCard";
import VehicleForm from "@/components/Vehicle/vehicleForm";
import { fetchClientSide } from "@/lib/utils/fetchClientSide";
import { Vehicle } from "@/types/types";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await fetchClientSide<Vehicle[]>("GET", "/vehicles");
        setVehicles(data);
      } catch (error) {
        console.error("Erro ao buscar veículos:", error);
        // redirecionar para login se necessário
      }
    };

    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVehiclesByBranch = filteredVehicles.filter((vehicle) => {
    if (!searchBranch || +searchBranch === 0) return true;
    return vehicle.branchId === +searchBranch;
  });

  return (
    <div className="px-10 bg-gray-950">
      <div className="max-w-7xl mx-auto">
        {showForm ? (
          <div className="fixed inset-0 bg-gray-950 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Adicionar Novo Veículo
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    X
                  </button>
                </div>
                <VehicleForm
                  onSubmit={() => setShowForm(false)}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <header className="flex flex-wrap justify-between items-center py-8">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Gestão de Veículos
                </h1>
                <p className="text-gray-400 mt-1">
                  Visualize e gerencie sua frota
                </p>
              </div>
              <input
                type="text"
                placeholder="Busque por placa, modelo ou motorista"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-1/3 bg-gray-700 text-white p-2 rounded focus:ring-0 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Filtre por filial"
                value={searchBranch}
                min={0}
                onChange={(e) => setSearchBranch(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded focus:ring-0 focus:outline-none"
              />
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Novo Veículo
              </button>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehiclesByBranch.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
