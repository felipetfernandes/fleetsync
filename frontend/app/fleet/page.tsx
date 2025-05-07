"use client";

import NewCarForm from "@/components/newCarForm";
import VehicleCard from "@/components/ui/vehicleCard";
import React, { useState } from "react";

// Dados de exemplo
const vehicles = [
  {
    id: "1",
    plate: "ABC1234",
    brand: "Toyota",
    model: "Corolla",
    modelYear: "2022",
    manufactureYear: "2021",
    color: "Preto",
    renavam: "12345678901",
    chassi: "9BRBL9BF1K0123456",
    branch: "São Paulo",
    driver: "João Silva",
    status: "Ativo",
  },
  {
    id: "2",
    plate: "DEF5678",
    brand: "Honda",
    model: "Civic",
    modelYear: "2021",
    manufactureYear: "2020",
    color: "Branco",
    renavam: "98765432101",
    chassi: "93HGK5830MZ123456",
    branch: "Rio de Janeiro",
    driver: "Maria Oliveira",
    status: "Manutenção",
  },
  {
    id: "3",
    plate: "GHI9012",
    brand: "Jeep",
    model: "Compass",
    modelYear: "2023",
    manufactureYear: "2022",
    color: "Cinza",
    renavam: "45678901234",
    chassi: "8AJYZ59G6K0123456",
    branch: "Belo Horizonte",
    driver: "Carlos Souza",
    status: "Ativo",
  },
  {
    id: "4",
    plate: "JKL3456",
    brand: "Chevrolet",
    model: "Onix",
    modelYear: "2020",
    manufactureYear: "2019",
    color: "Vermelho",
    renavam: "10293847561",
    chassi: "9BGKS19X0GB123456",
    branch: "Curitiba",
    driver: "Ana Lima",
    status: "Inativo",
  },
  {
    id: "5",
    plate: "MNO7890",
    brand: "Hyundai",
    model: "HB20",
    modelYear: "2022",
    manufactureYear: "2021",
    color: "Azul",
    renavam: "19283746509",
    chassi: "93HBE55G0LZ654321",
    branch: "Fortaleza",
    driver: "Pedro Martins",
    status: "Ativo",
  },
  {
    id: "6",
    plate: "PQR1234",
    brand: "Ford",
    model: "EcoSport",
    modelYear: "2019",
    manufactureYear: "2018",
    color: "Prata",
    renavam: "56473829102",
    chassi: "8AFDP85GXKL789012",
    branch: "Porto Alegre",
    driver: "Juliana Rocha",
    status: "Manutenção",
  },
  {
    id: "7",
    plate: "STU5678",
    brand: "Volkswagen",
    model: "Gol",
    modelYear: "2021",
    manufactureYear: "2020",
    color: "Preto",
    renavam: "84736291028",
    chassi: "9BWZZZ377VT004321",
    branch: "Salvador",
    driver: "Roberto Dias",
    status: "Ativo",
  },
  {
    id: "8",
    plate: "VWX9012",
    brand: "Ford",
    model: "Ka",
    modelYear: "2020",
    manufactureYear: "2019",
    color: "Branco",
    renavam: "65748392018",
    chassi: "8AFDP85G0KL654321",
    branch: "Recife",
    driver: "Fernanda Alves",
    status: "Ativo",
  },
  {
    id: "9",
    plate: "YZA3456",
    brand: "Jeep",
    model: "Renegade",
    modelYear: "2023",
    manufactureYear: "2022",
    color: "Verde",
    renavam: "90817263548",
    chassi: "8AJYZ59G9K0123487",
    branch: "Campinas",
    driver: "Bruno Teixeira",
    status: "Ativo",
  },
  {
    id: "10",
    plate: "BCD7890",
    brand: "Toyota",
    model: "Corolla Cross",
    modelYear: "2024",
    manufactureYear: "2023",
    color: "Grafite",
    renavam: "73829104657",
    chassi: "9BRBL9BF2K0567890",
    branch: "Brasília",
    driver: "Larissa Mendes",
    status: "Ativo",
  },
];

export default function FleetPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-10">
      {showForm ? (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Adicionar Novo Veículo
                </h2>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  x
                </button>
              </div>
              <NewCarForm />
              <button               
                onClick={() => setShowForm(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded mt-10"
              >
                Salvar Veículo
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <header className="flex flex-wrap justify-between items-center my-8 mx-40">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Gestão de Veículos
              </h1>
              <p className="text-gray-400 mt-1">
                Visualize e gerencie sua frota
              </p>
            </div>
            <input
              type="text"
              placeholder="Busque por placa, modelo, filial ou motorista"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-2/3 bg-gray-700 text-white p-2 rounded focus:ring-0 focus:outline-none"
            />
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded"
            >
              Novo Veículo
            </button>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
