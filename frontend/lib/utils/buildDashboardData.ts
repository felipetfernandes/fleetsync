import type { Order, Vehicle, Workshop } from "@/types/types"
import { avg, count, groupAndAggregate, groupOrdersByVehicle, sum } from "./groupedFunctions"

export function buildDashboardData({
  vehicles,
  orders,
  workshops,
}: {
  vehicles: Vehicle[]
  orders: Order[]
  workshops: Workshop[]
}) {
  const enrichedOrders = orders.map((item) => {
    const date = new Date(item.startDate)
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const vehiclePlate = item.vehicle.plate
    const branchName = item.branch.name
    const workshopName = item.workshop.name
    const vehicleBrand = item.vehicle.brand
    const vehicleModel = item.vehicle.model
    const driverName = vehicles.find((v) => v.id === item.vehicleId)?.driver?.name
    const durationDiff = item.endDate
      ? Math.floor((new Date(item.endDate).getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      : null

    return {
      ...item,
      month,
      branchName,
      branchId: item.branch.id,
      workshopName,
      vehiclePlate,
      vehicleBrand,
      vehicleModel,
      driverName,
      durationDiff,
    }
  })

  return {
    totalVehicles: vehicles.length,
    vehiclesInMaintenance: vehicles.filter((v) => v.status === "MAINTENANCE").length,
    pendingOrders: orders.filter((o) => !o.endDate).length,

    monthlyExpenses: Array.from({ length: 5 }).map((_, index) => {
      const now = new Date()
      const targetDate = new Date(now.getFullYear(), now.getMonth() - index, 1)
      const total = orders
        .filter((order) => {
          const orderDate = new Date(order.startDate)
          return orderDate.getMonth() === targetDate.getMonth() && orderDate.getFullYear() === targetDate.getFullYear()
        })
        .reduce((acc, order) => acc + order.totalCost, 0)

      return {
        month: targetDate.toLocaleString("pt-BR", { month: "short" }),
        value: total,
      }
    }),

    fleetStatus: {
      AVAILABLE: vehicles.filter((v) => v.status === "AVAILABLE").length,
      UNAVAILABLE: vehicles.filter((v) => v.status === "UNAVAILABLE").length,
      MAINTENANCE: vehicles.filter((v) => v.status === "MAINTENANCE").length,
    },

    _orderGroupedByYearMonth: groupAndAggregate(enrichedOrders, ["month"], {
      cost: (items) => sum(items.map((i) => i.totalCost)),
      services: (items) => count(items),
    }).sort((a, b) => a.month.localeCompare(b.month)),

    _orderGroupedByType: groupAndAggregate(enrichedOrders, ["type"], {
      totalCost: (items) => sum(items.map((i) => i.totalCost)),
      quantity: (items) => count(items),
      avgDuration: (items) => avg(items.map((i) => i.durationDiff).filter(Boolean)),
    }),

    _costByStatus: groupAndAggregate(enrichedOrders, ["status"], {
      cost: (items) => sum(items.map((i) => i.totalCost)),
      services: (items) => count(items),
    }),

    _costByBranch: groupAndAggregate(enrichedOrders, ["branchName", "branchId"], {
      totalCost: (items) => sum(items.map((i) => i.totalCost)),
      services: (items) => count(items),
    }).sort((a, b) => b.totalCost - a.totalCost),

    _inProgress: enrichedOrders
      .filter((item) => item.status === "IN_PROGRESS")
      .map((item) => ({
        vehiclePlate: item.vehiclePlate,
        description: item.description,
        startDate: item.startDate,
        totalCost: item.totalCost,
        workshopName: item.workshopName,
      }))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),

    _completed: enrichedOrders
      .filter((item) => item.status === "COMPLETED" && item.endDate)
      .map((item) => ({
        vehiclePlate: item.vehiclePlate,
        description: item.description,
        endDate: item.endDate,
        totalCost: item.totalCost,
        workshopName: item.workshopName,
      }))
      .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()),

    _ordersByVehicle: groupOrdersByVehicle(enrichedOrders),
  }
}
