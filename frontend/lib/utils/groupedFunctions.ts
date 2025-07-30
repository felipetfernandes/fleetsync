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

export function groupBy<T, K extends keyof any>(
  list: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return list.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {} as Record<K, T[]>);
}

export function sum(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0);
}

export function avg(arr: number[]): number | null {
  return arr.length ? sum(arr) / arr.length : null;
}

export function count(arr: any[]): number {
  return arr.length;
}

export function groupAndAggregate<T>(
  list: T[],
  groupKeys: (keyof T)[],
  metrics: Record<string, (items: T[]) => any>
): Record<string, any>[] {
  const grouped = list.reduce((acc, item) => {
    const key = groupKeys.map((k) => String(item[k])).join("|");
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);

  return Object.entries(grouped).map(([key, items]) => {
    const groupFields = Object.fromEntries(
      groupKeys.map((k, i) => [k, key.split("|")[i]])
    );
    const aggregates = Object.fromEntries(
      Object.entries(metrics).map(([name, fn]) => [name, fn(items)])
    );
    return { ...groupFields, ...aggregates };
  });
}

export function groupOrdersByVehicle(enrichedOrders: Order[]): GroupedOrder[] {
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
