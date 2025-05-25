import React from "react";
import {
  CheckCircle,
  XCircle,
  Wrench,
  Clock,
  Loader2,
  CircleCheck,
  CircleSlash,
} from "lucide-react";
import { OrderStatus, VehicleStatus } from "@/types/enums";

type BadgeConfig = {
  color: string;
  text: string;
  icon: React.ComponentType<any>;
};

const vehicleStatusMap: Record<VehicleStatus, BadgeConfig> = {
  [VehicleStatus.AVAILABLE]: {
    color: "bg-green-600",
    text: "Ativo",
    icon: CheckCircle,
  },
  [VehicleStatus.UNAVAILABLE]: {
    color: "bg-red-600",
    text: "Inativo",
    icon: XCircle,
  },
  [VehicleStatus.MAINTENANCE]: {
    color: "bg-yellow-600",
    text: "Manutenção",
    icon: Wrench,
  },
};

const orderStatusMap: Record<OrderStatus, BadgeConfig> = {
  [OrderStatus.PENDING]: {
    color: "bg-orange-600",
    text: "Pendente",
    icon: Clock,
  },
  [OrderStatus.APPROVED]: {
    color: "bg-blue-600",
    text: "Aprovado",
    icon: CircleCheck,
  },
  [OrderStatus.IN_PROGRESS]: {
    color: "bg-yellow-600",
    text: "Em Andamento",
    icon: Loader2,
  },
  [OrderStatus.COMPLETED]: {
    color: "bg-emerald-600",
    text: "Concluído",
    icon: CheckCircle,
  },
  [OrderStatus.CANCELLED]: {
    color: "bg-red-500",
    text: "Cancelado",
    icon: CircleSlash,
  },
};

type Props =
  | { type: "vehicleStatus"; status: VehicleStatus }
  | { type: "orderStatus"; status: OrderStatus };

export function StatusBadge(props: Props) {
  const config =
    props.type === "vehicleStatus"
      ? vehicleStatusMap[props.status]
      : orderStatusMap[props.status];

  const { color, text, icon: Icon } = config;

  return (
    <div className={`flex items-center gap-2 px-2 py-1 rounded text-sm text-white ${color}`}>
      <Icon className="w-4 h-4" />
      <span>{text}</span>
    </div>
  );
}
