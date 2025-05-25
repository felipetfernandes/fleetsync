"use client";

import { useEffect, useState } from "react";
import { PlusCircle, X } from "lucide-react";
import WorkshopForm from "@/components/Workshops/workshopForm";
import WorkshopCard from "@/components/ui/workshopCard";

export default function WorkshopsPage() {
  const [showForm, setShowForm] = useState(false);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("http://localhost:3001/workshops/vehicles/", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      setWorkshops(data);
      console.log(data);
    })();

  }, []);

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleAddWorkshop = (workshop: any) => {
    // Simular adição de uma nova oficina
    setWorkshops([
      ...workshops,
      {
        ...workshop,
        id: Date.now().toString(),
        vehiclesInMaintenance: [],
      },
    ]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Oficinas Cadastradas
            </h1>
            <p className="text-gray-400 mt-1">
              Gerencie as oficinas parceiras e acompanhe as manutenções
            </p>
          </div>
          <button
            onClick={handleOpenForm}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Oficina
          </button>
        </header>

        {showForm ? (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Adicionar Nova Oficina
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <WorkshopForm
                  onSubmit={handleAddWorkshop}
                  onCancel={handleCloseForm}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6">
            {workshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
