"use client";

import VehicleCard from "@/components/ui/vehicleCard";
import VehicleForm from "@/components/vehicleForm";
import { PlusCircle } from "lucide-react";
import React, { useState } from "react";
import { mockVehicles } from "@/lib/mockData";

export default function FleetPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filteredVehicles = mockVehicles.filter(
    (vehicle) =>
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                placeholder="Busque por placa, modelo, filial ou motorista"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-2/3 bg-gray-700 text-white p-2 rounded focus:ring-0 focus:outline-none"
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
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
