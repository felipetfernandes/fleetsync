// components/Workshop/workshopForm.tsx
"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { NEXT_PUBLIC_LOCAL_URL } from "@/lib/constants";

interface WorkshopFormProps {
  onSubmit: () => void;
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
    confirmPassword: "", // ✅ Novo campo adicionado
    phone: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Função para formatar CNPJ
  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 14) value = value.slice(0, 14);

    // Formata CNPJ: XX.XXX.XXX/XXXX-XX
    if (value.length > 12) {
      value = value.replace(
        /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/,
        "$1.$2.$3/$4-$5"
      );
    } else if (value.length > 8) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d*).*/, "$1.$2.$3/$4");
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{3})(\d*).*/, "$1.$2.$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d*).*/, "$1.$2");
    }

    setFormData((prev) => ({ ...prev, cnpj: value }));
  };

  // Função para formatar telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    // Formata telefone: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d*).*/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d*).*/, "($1) $2");
    }

    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // ✅ Validações atualizadas
    if (!formData.password) {
      setError("A senha é obrigatória");
      setIsLoading(false);
      return;
    }

    if (!formData.confirmPassword) {
      setError("A confirmação de senha é obrigatória");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não são iguais");
      setIsLoading(false);
      return;
    }

    try {
      // ✅ Remove confirmPassword antes de enviar para o backend
      const { confirmPassword, ...dataToSend } = formData;
      
      const response = await fetch(
        `${NEXT_PUBLIC_LOCAL_URL}/workshops/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(dataToSend),
        }
      );

      if (response.ok) {
        // Oficina registrada com sucesso
        onSubmit(); // Notifica o componente pai sobre o sucesso
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erro ao cadastrar oficina");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 flex flex-col">
          <label className="-mb-2" htmlFor="name">
            Nome da Oficina
          </label>
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
          <label className="-mb-2" htmlFor="cnpj">
            CNPJ
          </label>
          <Input
            id="cnpj"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleCNPJChange}
            placeholder="12.345.678/0001-90"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="-mb-2" htmlFor="email">
            Email
          </label>
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
          <label className="-mb-2" htmlFor="password">
            Senha
          </label>
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

        {/* ✅ Novo campo de confirmação de senha */}
        <div className="space-y-2 flex flex-col">
          <label className="-mb-2" htmlFor="confirmPassword">
            Confirmar Senha
          </label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="-mb-2" htmlFor="phone">
            Telefone
          </label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="(11) 3456-7890"
            required
          />
        </div>

        <div className="space-y-2 flex flex-col md:col-span-2">
          <label className="-mb-2" htmlFor="address">
            Endereço
          </label>
          <Input
            id="address"
            name="address"
            value={formData.address}
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
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded mt-10"
          disabled={isLoading}
        >
          {isLoading ? "Cadastrando..." : "Salvar Oficina"}
        </button>
      </div>
    </form>
  );
}