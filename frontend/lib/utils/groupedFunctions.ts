type Order = {
  totalCost?: number;
  vehiclePlate?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  driverName?: string;
};

type GroupedOrder = {
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  driverName: string;
  quantityOrders: number;
  totalCost: number;
};

export default function groupOrdersByVehicle(
  enrichedOrders: Order[]
): GroupedOrder[] {
  const grouped: Record<string, GroupedOrder> = {};

  for (const order of enrichedOrders) {
    const plate = order.vehiclePlate || "Sem placa";

    if (!grouped[plate]) {
      grouped[plate] = {
        vehiclePlate: plate,
        vehicleBrand: order.vehicleBrand || "Sem marca",
        vehicleModel: order.vehicleModel || "Sem modelo",
        driverName: order.driverName || "Sem motorista",
        quantityOrders: 0,
        totalCost: 0,
      };
    }

    grouped[plate].quantityOrders += 1;
    grouped[plate].totalCost += order.totalCost ?? 0;
  }

  return Object.values(grouped);
}
