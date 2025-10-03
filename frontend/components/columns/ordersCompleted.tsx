"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button"

export type CompletedOrderColumns = {
  vehiclePlate: string
  description: string
  endDate: string
  totalCost: number
  workshopName: string
}

export const ordersCompleted: ColumnDef<CompletedOrderColumns>[] = [
  {
    accessorKey: "vehiclePlate",
    header: "Placa",
    cell: ({ row }) => row.getValue<string>("vehiclePlate"),
    meta: {
      className: "w-[120px]",
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => <span className="line-clamp-2">{row.getValue<string>("description")}</span>,
    meta: {
      className: "w-[300px]",
    },
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Data de Conclusão
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    meta: {
      className: "w-[100px] text-center",
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue<string>("endDate"))
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    },
  },
  {
    accessorKey: "totalCost",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Custo (R$)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    meta: {
      className: "w-[100px] text-center",
    },
    cell: ({ row }) => {
      const value = row.getValue<number>("totalCost")
      return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    },
  },
  {
    accessorKey: "workshopName",
    header: "Oficina",
    meta: {
      className: "w-[200px]",
    },
    cell: ({ row }) => row.getValue<string>("workshopName"),
  },
]
