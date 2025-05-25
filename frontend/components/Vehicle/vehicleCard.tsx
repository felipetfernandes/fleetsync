import { Vehicle } from "@/types/types";
import { Car } from "lucide-react";
import Link from "next/link";
import React from "react";
import { StatusBadge } from "../ui/statusBadge";
import { VehicleStatus } from "@/types/enums";

const infos = {
  brand: "Marca",
  model: "Modelo",
  modelYear: "Ano Modelo",
  manufactureYear: "Ano Fabricação",
  color: "Cor",
  renavam: "Renavam",
  chassis: "Chassis",
  branchId: "Filial",
};

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link href={`/fleet/${vehicle.plate}`}>
      <div className="text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
        <div className="flex justify-between items-start mb-6">
          <span className="flex items-center">
            <Car className="mr-2 h-5 w-5 text-indigo-400" />
            <h1 className="text-xl font-bold flex items-center">
              {vehicle.plate}
            </h1>
          </span>
          <StatusBadge status={vehicle.status as VehicleStatus} type="vehicleStatus" />
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {Object.keys(infos).map((value) => {
            return (
              <span key={value}>
                <p className="text-gray-400">
                  {infos[value as keyof typeof infos]}
                </p>
                <p className="font-medium">
                  {vehicle[value as keyof typeof infos]}
                </p>
              </span>
            );
          })}
          <span>
            <p className="text-gray-400">Motorista</p>
            <p className="font-medium">{vehicle.driver?.name}</p>
          </span>
        </div>
      </div>
    </Link>
  );
}
