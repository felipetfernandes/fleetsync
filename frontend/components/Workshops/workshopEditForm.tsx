"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import type { Workshop } from "@/types/types"
import { fetchClientSide } from "@/lib/utils/fetchClientSide"
import { Loader2 } from "lucide-react"

interface WorkshopEditFormProps {
  workshop: Workshop
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function WorkshopEditForm({ workshop, onSubmit, onCancel }: WorkshopEditFormProps) {
  const [formData, setFormData] = useState({
    name: workshop.name,
    cnpj: workshop.cnpj,
    email: workshop.email,
    phone: workshop.phone,
    address: workshop.address,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Função para formatar CNPJ
  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 14) value = value.slice(0, 14)

    // Formata CNPJ: XX.XXX.XXX/XXXX-XX
    if (value.length > 12) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, "$1.$2.$3/$4-$5")
    } else if (value.length > 8) {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d*).*/, "$1.$2.$3/$4")
    } else if (value.length > 5) {
      value = value.replace(/^(\d{2})(\d{3})(\d*).*/, "$1.$2.$3")
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d*).*/, "$1.$2")
    }

    setFormData((prev) => ({ ...prev, cnpj: value }))
  }

  // Função para formatar telefone
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 11) value = value.slice(0, 11)

    // Formata telefone: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3")
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d*).*/, "($1) $2-$3")
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d*).*/, "($1) $2")
    }

    setFormData((prev) => ({ ...prev, phone: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const updateData = {
        name: formData.name,
        cnpj: formData.cnpj.replace(/\D/g, ""), // Remove formatação do CNPJ
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ""), // Remove formatação do telefone
        address: formData.address,
      }

      const response = await fetchClientSide("PUT", `/workshops/${workshop.id}`, updateData)
      onSubmit(response)
    } catch (error: any) {
      console.error("Erro ao atualizar oficina:", error)
      setError(error.message || "Erro ao atualizar oficina")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-gray-800 p-6 rounded-lg flex items-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            <span className="text-white">Atualizando oficina...</span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-900 rounded-lg w-full max-h-[90vh] overflow-y-auto p-6"
      >
        {error && <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-300">
              Nome da Oficina
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Auto Center Express"
              className="bg-gray-800 border-gray-700"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="cnpj" className="text-sm font-medium text-gray-300">
              CNPJ
            </label>
            <Input
              id="cnpj"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleCNPJChange}
              placeholder="12.345.678/0001-90"
              className="bg-gray-800 border-gray-700"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contato@oficina.com"
              className="bg-gray-800 border-gray-700"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-300">
              Telefone
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="(11) 3456-7890"
              className="bg-gray-800 border-gray-700"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label htmlFor="address" className="text-sm font-medium text-gray-300">
              Endereço
            </label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Av. Paulista, 1000, São Paulo - SP"
              className="bg-gray-800 border-gray-700"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
          <button
            type="button"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white px-4 py-2 border rounded"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center space-x-2"
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{loading ? "Salvando..." : "Salvar Alterações"}</span>
          </button>
        </div>
      </form>
    </>
  )
}
