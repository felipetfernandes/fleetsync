"use client";

import type React from "react";

import { useState } from "react";
import Input from "@/components/ui/input";

interface WorkshopFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function WorkshopForm({
  onSubmit,
  onCancel,
}: WorkshopFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    cnpj: "",
    email: "",
    password: "",
    telephone: "",
    adress: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 flex flex-col">
          <label className="-mb-2" htmlFor="name">Nome da Oficina</label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Auto Center Express"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="-mb-2" htmlFor="cnpj">CNPJ</label>
          <Input
            id="cnpj"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleChange}
            placeholder="12.345.678/0001-90"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="-mb-2" htmlFor="email">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contato@oficina.com"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="-mb-2" htmlFor="password">Senha</label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="-mb-2" htmlFor="telephone">Telefone</label>
          <Input
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            placeholder="(11) 3456-7890"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col md:col-span-2">
          <label className="-mb-2" htmlFor="adress">Endereço</label>
          <Input
            id="adress"
            name="adress"
            value={formData.adress}
            onChange={handleChange}
            placeholder="Av. Paulista, 1000, São Paulo - SP"
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
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded mt-10">
          Salvar Oficina
        </button>
      </div>
    </form>
  );
}
