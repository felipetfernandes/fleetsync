"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, FileEdit, Trash2, FileText } from "lucide-react"

// Dados de exemplo
const services = [
  {
    id: "1",
    vehiclePlate: "ABC1234",
    vehicleModel: "Hilux",
    type: "Manutenção Preventiva",
    description: "Troca de óleo e filtros",
    date: "15/04/2023",
    cost: "R$ 450,00",
    status: "Concluído",
  },
  {
    id: "\
    date: '15/04/2023",
    cost: "R$ 450,00",
    status: "Concluído",
  },
  {
    id: "2",
    vehiclePlate: "DEF5678",
    vehicleModel: "Ranger",
    type: "Reparo",
    description: "Substituição de amortecedores",
    date: "22/04/2023",
    cost: "R$ 1.200,00",
    status: "Em andamento",
  },
  {
    id: "3",
    vehiclePlate: "GHI9012",
    vehicleModel: "S10",
    type: "Revisão",
    description: "Revisão de 30.000 km",
    date: "05/05/2023",
    cost: "R$ 850,00",
    status: "Agendado",
  },
  {
    id: "4",
    vehiclePlate: "JKL3456",
    vehicleModel: "Toro",
    type: "Emergencial",
    description: "Reparo no sistema de freios",
    date: "10/05/2023",
    cost: "R$ 680,00",
    status: "Concluído",
  },
  {
    id: "5",
    vehiclePlate: "MNO7890",
    vehicleModel: "L200",
    type: "Manutenção Preventiva",
    description: "Alinhamento e balanceamento",
    date: "18/05/2023",
    cost: "R$ 320,00",
    status: "Concluído",
  },
]

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredServices = services.filter(
    (service) =>
      service.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Em andamento":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Agendado":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Serviços de Oficina</h1>
        <Button asChild>
          <Link href="/services/add">
            <Plus className="mr-2 h-4 w-4" />
            Novo Serviço
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Serviços</CardTitle>
          <CardDescription>Acompanhe todos os serviços realizados na sua frota.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por placa, modelo ou tipo de serviço..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Custo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div className="font-medium">{service.vehiclePlate}</div>
                        <div className="text-sm text-muted-foreground">{service.vehicleModel}</div>
                      </TableCell>
                      <TableCell>{service.type}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>{service.date}</TableCell>
                      <TableCell>{service.cost}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              Detalhes
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum serviço encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
