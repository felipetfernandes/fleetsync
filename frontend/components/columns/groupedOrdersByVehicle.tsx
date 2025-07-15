"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Group, Ungroup } from "lucide-react";
import { Button } from "../ui/button";
import { formatCurrency } from "@/lib/utils/formatFunctions";

export type GroupedOrderByVehicle = {
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  driverName: string;
  quantityOrders: number;
  totalCost: number;
};

export const groupedOrdersByVehicle: ColumnDef<GroupedOrderColumns>[] = [
  {
    accessorKey: "vehiclePlate",
    header: "Placa",
    cell: ({ row }) => row.getValue<string>("vehiclePlate"),
    meta: {
      className: "w-[120px]",
    },
  },
  {
    accessorKey: "vehicleBrand",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleGrouping()}>
        Marca
        {column.getIsGrouped() ? (
          <Ungroup className="ml-2 h-4 w-4" />
        ) : (
          <Group className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row, getValue, column }) => {
      // Verifica se é uma célula de grupo
      if (row.groupingColumnId === column.id) {
        return (
          <div className="font-bold">
            {getValue()} ({row.subRows.length})
          </div>
        );
      }
      return getValue();
    },
    meta: {
      className: "w-[120px]",
    },
    enableGrouping: true,
  },
  {
    accessorKey: "vehicleModel",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleGrouping()}>
        Modelo
        {column.getIsGrouped() ? (
          <Ungroup className="ml-2 h-4 w-4" />
        ) : (
          <Group className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row, getValue, column }) => {
      // Verifica se é uma célula de grupo
      if (row.groupingColumnId === column.id) {
        return (
          <div className="font-bold">
            {getValue()} ({row.subRows.length})
          </div>
        );
      }
      return getValue();
    },
    meta: {
      className: "w-[150px]",
    },
    enableGrouping: true,
  },
  {
    accessorKey: "driverName",
    header: "Motorista",
    cell: ({ row }) => row.getValue<string>("driverName"),
    meta: {
      className: "w-[180px]",
    },
  },
  {
    accessorKey: "quantityOrders",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ordens
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.getValue<number>("quantityOrders"),
    meta: {
      className: "w-[80px] text-center",
    },
  },
  {
    accessorKey: "totalCost",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Custo Total (R$)
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue<number>("totalCost");
      return formatCurrency(value);
    },
    meta: {
      className: "w-[130px] text-center",
    },
  },
];
