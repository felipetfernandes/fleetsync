"use client";

import type React from "react";

import { useState } from "react";
import Input from "@/components/ui/input";

interface VehicleFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function VehicleForm({ onSubmit, onCancel }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    plate: "",
    filial: "",
    model: "",
    brand: "",
    yearModelo: "",
    yearFabricacao: "",
    color: "",
    renavam: "",
    chassi: "",
    status: "Ativo",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 flex flex-col ">
          <label htmlFor="plate" className="text-gray-100 -mb-2">
            Placa
          </label>
          <Input
            id="plate"
            name="plate"
            value={formData.plate}
            onChange={handleChange}
            placeholder="ABC1234"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="filial" className="text-gray-100 -mb-2">
            Filial
          </label>
          <Input
            id="filial"
            name="filial"
            value={formData.filial}
            onChange={handleChange}
            placeholder="São Paulo"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="brand" className="text-gray-100 -mb-2">
            Marca
          </label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="Toyota"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="model" className="text-gray-100 -mb-2">
            Modelo
          </label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Corolla"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="yearModelo" className="text-gray-100 -mb-2">
            Ano Modelo
          </label>
          <Input
            id="yearModelo"
            name="yearModelo"
            value={formData.yearModelo}
            onChange={handleChange}
            placeholder="2022"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="yearFabricacao" className="text-gray-100 -mb-2">
            Ano Fabricação
          </label>
          <Input
            id="yearFabricacao"
            name="yearFabricacao"
            value={formData.yearFabricacao}
            onChange={handleChange}
            placeholder="2021"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="color" className="text-gray-100 -mb-2">
            Cor
          </label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="Preto"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="status" className="text-gray-100 -mb-2">
            Status
          </label>
          <select
            name="status"
            className="bg-gray-800 p-2 rounded focus:ring-0 focus:outline-none text-gray-100 border border-gray-600"
          >
            <option value="Ativo">Ativo</option>
            <option value="Manutenção">Manutenção</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="renavam" className="text-gray-100 -mb-2">
            Renavam
          </label>
          <Input
            id="renavam"
            name="renavam"
            value={formData.renavam}
            onChange={handleChange}
            placeholder="12345678901"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="chassi" className="text-gray-100 -mb-2">
            Chassi
          </label>
          <Input
            id="chassi"
            name="chassi"
            value={formData.chassi}
            onChange={handleChange}
            placeholder="9BRBL9BF1K0123456"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white p-2 rounded mt-10"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded mt-10"
        >
          Salvar Veículo
        </button>
      </div>
    </form>
  );
}
