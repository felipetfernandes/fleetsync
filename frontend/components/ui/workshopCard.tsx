import React from "react";

import {
  Wrench,
  MapPin,
  Phone,
  Mail,
  Building,
  Car,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export default function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      key={workshop.id}
      className="bg-gray-900 border border-gray-800 p-8 rounded-2xl"
    >
      <div className="pb-2">
        <div className="flex justify-between items-start">
          <h1 className="text-xl font-bold flex items-center mb-8">
            <Wrench className="mr-2 h-5 w-5 text-indigo-400" />
            {workshop.name}
          </h1>
          <div className="bg-indigo-600 hover:bg-indigo-700 rounded-2xl px-3 py-0.5">
            {workshop.vehiclesInMaintenance.length} veículo(s)
          </div>
        </div>
      </div>
      <div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-start">
              <Building className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-400 text-sm">CNPJ</p>
                <p className="font-medium">{workshop.cnpj}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-400 text-sm">Endereço</p>
                <p className="font-medium">{workshop.adress}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-400 text-sm">Telefone</p>
                <p className="font-medium">{workshop.telephone}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="font-medium">{workshop.email}</p>
              </div>
            </div>
          </div>

          {workshop.vehiclesInMaintenance.length > 0 && (
            <div className="w-full">
              <div className="border-gray-800">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center justify-between"
                >
                  <span>Veículos em Manutenção</span>
                  <ChevronDown />
                </button>
                <div>
                  <div className="space-y-3 pt-2">
                    {isOpen &&
                      workshop.vehiclesInMaintenance.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="bg-gray-800 rounded-md p-3"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <Car className="h-4 w-4 mr-2 text-indigo-400" />
                              <span className="font-medium">
                                {vehicle.plate}
                              </span>
                            </div>
                            <div className="text-xs border-amber-600 text-amber-400">
                              {vehicle.status}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                            <div>
                              <p className="text-gray-400 text-xs">
                                Marca/Modelo
                              </p>
                              <p>
                                {vehicle.brand} {vehicle.model}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Cor</p>
                              <p>{vehicle.color}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-400 text-xs">Serviço</p>
                            <p className="text-sm">
                              {vehicle.serviceDescription}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
