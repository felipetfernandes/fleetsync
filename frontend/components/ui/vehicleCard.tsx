import React from "react";

type Vehicles = {
  id: string;
  plate: string;
  brand: string;
  model: string;
  modelYear: string;
  manufactureYear: string;
  color: string;
  renavam: string;
  chassi: string;
  branch: string;
  driver: string;
  status: string;
};

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

export default function VehicleCard({ vehicle }: { vehicle: Vehicles }) {
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
    <div className="text-gray-100 bg-gray-950 border-gray-600 border-2 p-4 rounded-2xl">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-xl font-bold flex items-center">{vehicle.plate}</h1>
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
                <p className="font-medium">{vehicle[value as keyof Vehicles]}</p>
              </span>
            );
          })}
      </div>
    </div>
  );
}
