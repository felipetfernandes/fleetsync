"use client";

import type React from "react";

import { useState } from "react";
import Input from "@/components/ui/input";

// Dados de exemplo para os selects
const mockVehicles = [
  { plate: "ABC1234", model: "Corolla", brand: "Toyota" },
  { plate: "DEF5678", model: "Civic", brand: "Honda" },
  { plate: "GHI9012", model: "Compass", brand: "Jeep" },
  { plate: "JKL3456", model: "Onix", brand: "Chevrolet" },
  { plate: "MNO7890", model: "HB20", brand: "Hyundai" },
];

const mockWorkshops = [
  { id: "w1", name: "Auto Center Express" },
  { id: "w2", name: "Mecânica Precisão" },
  { id: "w3", name: "Oficina Central" },
  { id: "w4", name: "Auto Elétrica Confiança" },
];

const mockDrivers = [
  { id: "d1", name: "Carlos Silva" },
  { id: "d2", name: "Ana Oliveira" },
  { id: "d3", name: "Pedro Santos" },
  { id: "d4", name: "Mariana Costa" },
];

const mockFiliais = [
  "São Paulo",
  "Rio de Janeiro",
  "Belo Horizonte",
  "Brasília",
  "Curitiba",
];

const serviceTypes = [
  "Manutenção Preventiva",
  "Manutenção Corretiva",
  "Manutenção Emergencial",
  "Revisão Programada",
  "Troca de Óleo",
  "Alinhamento e Balanceamento",
];

const orderStatus = [
  "Agendado",
  "Veículo Entregue",
  "Em Andamento",
  "Concluído",
  "Cancelado",
];

interface OrderFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function OrderForm({ onSubmit, onCancel }: OrderFormProps) {
  const [formData, setFormData] = useState({
    description: "",
    type: "Manutenção Preventiva",
    cost: "",
    vehiclePlate: "",
    driverId: "",
    workshopId: "",
    filial: "",
    status: "Agendado",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    return null;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-900 rounded-lg w-full max-h-[90vh] overflow-y-auto p-6 mb-10"
    >
      <div className="h-full flex flex-col">
        <label htmlFor="description">Descrição do Serviço</label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva o serviço a ser realizado"
          className="bg-gray-800 border-gray-700 min-h-[80px] h-full"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <div className="space-y-2 flex flex-col">
          <label htmlFor="type" className="-mb-2">Tipo de Serviço</label>
          <select className="bg-gray-800 border-gray-700 p-2 rounded border" value={formData.type}>
            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="cost" className="-mb-2">Custo Estimado (R$)</label>
          <Input
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder="0,00"
            className="bg-gray-800 border-gray-700"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="vehiclePlate" className="-mb-2">Veículo</label>
          <select
            value={formData.vehiclePlate}
            className="bg-gray-800 border-gray-700 p-2 rounded border"
          >
            {mockVehicles.map((vehicle) => (
              <option key={vehicle.plate} value={vehicle.plate}>
                {vehicle.plate} - {vehicle.brand} {vehicle.model}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="driverId" className="-mb-2">Motorista</label>
          <select
            value={formData.driverId}
            className="bg-gray-800 border-gray-700 p-2 rounded border"
          >
            {mockDrivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="workshopId" className="-mb-2">Oficina</label>
          <select
            value={formData.workshopId}
            className="bg-gray-800 border-gray-700 p-2 rounded border"
          >
            {mockWorkshops.map((workshop) => (
              <option key={workshop.id} value={workshop.id}>
                {workshop.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="filial" className="-mb-2">Filial</label>
          <select
            value={formData.filial}
            className="bg-gray-800 border-gray-700 p-2 rounded border"
          >
            {mockFiliais.map((filial) => (
              <option key={filial} value={filial}>
                {filial}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="status" className="-mb-2">Status</label>
          <select
            value={formData.status}
            className="bg-gray-800 border-gray-700 p-2 rounded border"
          >
            {orderStatus.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 flex flex-col md:col-span-2">
          <label htmlFor="notes" className="-mb-2">Observações</label>
          <Input
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Observações adicionais sobre o serviço"
            className="bg-gray-800 border-gray-700 min-h-[80px]"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white p-2 rounded text-sm"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm"
          onSubmit={onSubmit}
        >
          Salvar Ordem
        </button>
      </div>
    </form>
  );
}
