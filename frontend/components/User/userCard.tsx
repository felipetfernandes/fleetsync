"use client";

import { User } from "@/types/types";
import {
  UserCircle,
  Car,
  Phone,
  Mail,
  Calendar,
  Building2,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { UserRole } from "@/types/enums";

// Função para obter o nome da função em português
const getRoleName = (role: UserRole): string => {
  const roleNames = {
    ADMIN: "Administrador",
    DRIVER: "Motorista",
    WORKSHOP_MANAGER: "Gerente de Oficina",
    BRANCH_MANAGER: "Gerente de Filial",
  };

  return roleNames[role] || role;
};

// Função para obter a cor do badge da função
const getRoleColor = (role: UserRole): string => {
  const roleColors = {
    ADMIN: "bg-purple-900/30 text-purple-400",
    DRIVER: "bg-blue-900/30 text-blue-400",
    WORKSHOP_MANAGER: "bg-amber-900/30 text-amber-400",
    BRANCH_MANAGER: "bg-emerald-900/30 text-emerald-400",
  };

  return roleColors[role] || "bg-gray-900/30 text-gray-400";
};

export default function UserCard({ user }: { user: User }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <Link
        href={`/team/${user.id}`}
        className="block p-6 hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="bg-gray-800 rounded-full p-2 mr-3">
              <UserCircle className="h-8 w-8 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{user.name}</h3>
              <div
                className={`inline-block px-2 py-0.5 rounded-full text-xs ${getRoleColor(
                  user.role
                )}`}
              >
                {getRoleName(user.role)}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-300">{user.email}</span>
          </div>

          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-gray-400" />
            <span className="text-sm text-gray-300">{user.phone}</span>
          </div>

          {user.role === "DRIVER" && user.Vehicle && (
            <div className="flex items-center">
              <Car className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm text-gray-300">
                Veículo: {user.Vehicle.plate} - {user.Vehicle.brand}{" "}
                {user.Vehicle.model}
              </span>
            </div>
          )}

          {user.role === "DRIVER" && user.licenseNumber && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm text-gray-300">
                CNH: {user.licenseNumber} ({user.licenseCategory}) - Validade:{" "}
                {new Date(user.licenseExpiration!).toLocaleDateString("pt-BR")}
              </span>
            </div>
          )}

          {user.role === "WORKSHOP_MANAGER" && user.Workshop && (
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm text-gray-300">
                Oficina: {user.Workshop.name}
              </span>
            </div>
          )}

          {user.role === "BRANCH_MANAGER" && user.Branch && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm text-gray-300">
                Filial: {user.Branch.name} - {user.Branch.city}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
