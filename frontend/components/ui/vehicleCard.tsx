import { Car } from "lucide-react";
import React from "react";


const infos = [
  "Marca",
  "Modelo",
  "Ano Modelo",
  "Ano Fabricação",
  "Cor",
  "Renavam",
  "Chassi",
  "Filial",
  "Motorista",
];

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  let statusColorClass = "";

  switch (vehicle.status) {
    case "Manutenção":
      statusColorClass = "bg-yellow-700";
      break;
    case "Inativo":
      statusColorClass = "bg-red-700";
      break;
    default:
      statusColorClass = "bg-green-700";
  }
  return (
    <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
      <div className="flex justify-between items-start mb-6">
        <span className="flex items-center">
        <Car className="mr-2 h-5 w-5 text-indigo-400" />
        <h1 className="text-xl font-bold flex items-center">{vehicle.plate}</h1>
        </span>
        <p className={`px-2 py-0.5 rounded-2xl ${statusColorClass}`}>
          {vehicle.status}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {Object.keys(vehicle)
          .slice(2, -1)
          .map((value, id) => {
            return (
              <span key={id}>
                <p className="text-gray-400">{infos[id]}</p>
                <p className="font-medium">{vehicle[value as keyof Vehicle]}</p>
              </span>
            );
          })}
      </div>
    </div>
  );
}
