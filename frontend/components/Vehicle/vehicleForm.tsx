"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Input from "@/components/ui/input";

interface VehicleFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function VehicleForm({ onSubmit, onCancel }: VehicleFormProps) {
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    plate: "",
    branchId: "",
    model: "",
    brand: "",
    modelYear: "",
    manufactureYear: "",
    color: "",
    renavam: "",
    chassis: "",
    status: "AVAILABLE",
    mileageStart: "",
  });
  const [branchs, setBranchs] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranchs = async () => {
      const response = await fetch("http://localhost:3001/branchs", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setBranchs(data);
      setFormData((prev) => ({ ...prev, branchId: String(data[0].id) }));
    };
    fetchBranchs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const preparedFormData = {
      ...formData,
      branchId: parseInt(formData.branchId),
      modelYear: parseInt(formData.modelYear),
      manufactureYear: parseInt(formData.manufactureYear),
      mileageStart: parseInt(formData.mileageStart),
    };

    const res = await fetch("http://localhost:3001/vehicles", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preparedFormData),
    }).then((res) => res.json());
    if (res.ok) onSubmit(formData);
    else setError(res.message);
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
          <label htmlFor="branchId" className="text-gray-100 -mb-2">
            Filial (ID)
          </label>
          <select
            name="branchId"
            className="bg-gray-800 p-2 rounded focus:ring-0 focus:outline-none text-gray-100 border border-gray-600"
            onChange={handleChange}
          >
            {branchs.map((branch) => {
              return (
                <option
                  value={branch.id}
                  key={branch.id}
                >{`${branch.name} ${branch.city}`}</option>
              );
            })}
          </select>
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
          <label htmlFor="modelYear" className="text-gray-100 -mb-2">
            Ano Modelo
          </label>
          <Input
            id="modelYear"
            name="modelYear"
            value={formData.modelYear}
            onChange={handleChange}
            placeholder="2022"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="manufactureYear" className="text-gray-100 -mb-2">
            Ano Fabricação
          </label>
          <Input
            id="manufactureYear"
            name="manufactureYear"
            value={formData.manufactureYear}
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
            onChange={handleChange}
          >
            <option value="AVAILABLE">Ativo</option>
            <option value="MAINTENANCE">Manutenção</option>
            <option value="UNAVAILABLE">Inativo</option>
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
          <label htmlFor="chassis" className="text-gray-100 -mb-2">
            Chassis
          </label>
          <Input
            id="chassis"
            name="chassis"
            value={formData.chassis}
            onChange={handleChange}
            placeholder="9BRBL9BF1K0123456"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label htmlFor="mileageStart " className="text-gray-100 -mb-2">
            Odômetro
          </label>
          <Input
            id="mileageStart"
            name="mileageStart"
            value={formData.mileageStart}
            onChange={handleChange}
            placeholder="12345678901"
            required
          />
        </div>
      </div>

      <div className="flex flex-col w-full items-center justify-center">
        {error && <p className="text-red-500">{error}</p>}
      </div>

      <div className="flex justify-end space-x-4">
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
