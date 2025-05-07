"use client"

import { useState } from "react"
import { PlusCircle, X } from "lucide-react"
import WorkshopForm from "@/components/workshopForm"
import WorkshopCard from "@/components/ui/workshopCard"

// Dados de exemplo para oficinas
const mockWorkshops = [
    {
      id: "1",
      name: "Auto Center Express",
      cnpj: "12.345.678/0001-90",
      email: "contato@autocenterexpress.com",
      telephone: "(11) 3456-7890",
      adress: "Av. Paulista, 1000, São Paulo - SP",
      vehiclesInMaintenance: [
        {
          id: "v1",
          plate: "ABC1234",
          model: "Corolla",
          brand: "Toyota",
          color: "Preto",
          status: "Manutenção",
          serviceDescription: "Revisão de 30.000 km",
          modelYear: "2022",
          manufactureYear: "2021",
          renavam: "12345678901",
          chassi: "9BRBL9BF1K0123456",
          driver: "João da Silva",
          branch: "São Paulo",
        },
        {
          id: "v2",
          plate: "DEF5678",
          model: "Civic",
          brand: "Honda",
          color: "Branco",
          status: "Manutenção",
          serviceDescription: "Troca de embreagem",
          modelYear: "2021",
          manufactureYear: "2020",
          renavam: "98765432101",
          chassi: "93HGK5830MZ123456",
          driver: "Maria Oliveira",
          branch: "São Paulo",
        },
      ],
    },
    {
      id: "2",
      name: "Mecânica Precisão",
      cnpj: "98.765.432/0001-10",
      email: "atendimento@mecanicaprecisao.com",
      telephone: "(11) 2345-6789",
      adress: "Rua Augusta, 500, São Paulo - SP",
      vehiclesInMaintenance: [
        {
          id: "v3",
          plate: "GHI9012",
          model: "Compass",
          brand: "Jeep",
          color: "Cinza",
          status: "Manutenção",
          serviceDescription: "Reparo no sistema de freios",
          modelYear: "2023",
          manufactureYear: "2022",
          renavam: "45678901234",
          chassi: "8AJYZ59G6K0123456",
          driver: "Carlos Souza",
          branch: "São Paulo",
        },
      ],
    },
    {
      id: "3",
      name: "Oficina Central",
      cnpj: "45.678.901/0001-23",
      email: "contato@oficinacentral.com",
      telephone: "(21) 3456-7890",
      adress: "Av. Rio Branco, 150, Rio de Janeiro - RJ",
      vehiclesInMaintenance: [],
    },
    {
      id: "4",
      name: "Auto Elétrica Confiança",
      cnpj: "34.567.890/0001-12",
      email: "servicos@autoeletricaconfianca.com",
      telephone: "(31) 2345-6789",
      adress: "Av. Afonso Pena, 2000, Belo Horizonte - MG",
      vehiclesInMaintenance: [
        {
          id: "v4",
          plate: "JKL3456",
          model: "Onix",
          brand: "Chevrolet",
          color: "Vermelho",
          status: "Manutenção",
          serviceDescription: "Reparo no sistema elétrico",
          modelYear: "2020",
          manufactureYear: "2019",
          renavam: "32165498701",
          chassi: "9BGKS69G0GB123456",
          driver: "Ana Martins",
          branch: "Belo Horizonte",
        },
        {
          id: "v5",
          plate: "MNO7890",
          model: "HB20",
          brand: "Hyundai",
          color: "Prata",
          status: "Manutenção",
          serviceDescription: "Troca de bateria e alternador",
          modelYear: "2021",
          manufactureYear: "2020",
          renavam: "78945612309",
          chassi: "9BHBG41DBBP123456",
          driver: "Fernando Lima",
          branch: "Belo Horizonte",
        },
        {
          id: "v6",
          plate: "PQR1234",
          model: "Renegade",
          brand: "Jeep",
          color: "Verde",
          status: "Manutenção",
          serviceDescription: "Diagnóstico de falha no motor",
          modelYear: "2022",
          manufactureYear: "2021",
          renavam: "65478932108",
          chassi: "93HRE28BBMZ123456",
          driver: "Juliana Rocha",
          branch: "Belo Horizonte",
        },
      ],
    },
  ];
  

export default function WorkshopsPage() {
  const [showForm, setShowForm] = useState(false)
  const [workshops, setWorkshops] = useState(mockWorkshops)

  const handleOpenForm = () => {
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
  }

  const handleAddWorkshop = (workshop: any) => {
    // Simular adição de uma nova oficina
    setWorkshops([
      ...workshops,
      {
        ...workshop,
        id: Date.now().toString(),
        vehiclesInMaintenance: [],
      },
    ])
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Oficinas Cadastradas</h1>
            <p className="text-gray-400 mt-1">Gerencie as oficinas parceiras e acompanhe as manutenções</p>
          </div>
          <button onClick={handleOpenForm} className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Oficina
          </button>
        </header>

        {showForm ? (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Adicionar Nova Oficina</h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <WorkshopForm onSubmit={handleAddWorkshop} onCancel={handleCloseForm} />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {workshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
