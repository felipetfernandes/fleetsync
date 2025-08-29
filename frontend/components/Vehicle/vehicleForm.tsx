"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import type { Branch } from "@/types/types"
import { NEXT_PUBLIC_LOCAL_URL } from "@/lib/constants"
import { Loader2 } from "lucide-react"

interface VehicleFormProps {
  onSubmit: () => void
  onCancel: () => void
}

export default function VehicleForm({ onSubmit, onCancel }: VehicleFormProps) {
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
  })

  const [branchs, setBranchs] = useState<Branch[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // 🔧 Modelos por marca
  const modelsByBrand: Record<string, string[]> = {
    HONDA: ["CG 160 Start", "CG 160 Fan", "CG 160 Titan", "CG 160 Cargo", "NXR 160 Bros"],
    YAMAHA: ["Factor 125", "Fazer 150", "YS 250", "Neo 125", "XJ6"],
  }

  useEffect(() => {
    const fetchBranchs = async () => {
      try {
        const response = await fetch(`${NEXT_PUBLIC_LOCAL_URL}/branchs`, {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        setBranchs(data)
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, branchId: String(data[0].id) }))
        }
      } catch (err) {
        console.error("Erro ao carregar filiais:", err)
      }
    }
    fetchBranchs()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    let processedValue = value

    if (name === "plate") {
      processedValue = value.toUpperCase()
    } else if (name === "modelYear" || name === "manufactureYear" || name === "mileageStart") {
      processedValue = value.replace(/\D/g, "")
    } else if (name === "renavam") {
      processedValue = value.replace(/\D/g, "")
    } else if (name === "chassis") {
      processedValue = value.toUpperCase()
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const preparedFormData = {
      ...formData,
      branchId: Number.parseInt(formData.branchId),
      modelYear: Number.parseInt(formData.modelYear),
      manufactureYear: Number.parseInt(formData.manufactureYear),
      mileageStart: Number.parseInt(formData.mileageStart),
    }

    try {
      const response = await fetch(`${NEXT_PUBLIC_LOCAL_URL}/vehicles`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preparedFormData),
      })

      if (response.ok) {
        setTimeout(() => {
          onSubmit()
        }, 500)
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Erro ao salvar veículo")
        setIsLoading(false)
      }
    } catch (err) {
      console.error(err)
      setError("Erro de conexão com o servidor")
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700"
    >
      {error && (
        <div className="bg-red-800/40 border border-red-600 text-red-200 p-3 rounded-lg font-medium text-sm">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg flex items-center space-x-3 shadow-xl">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            <span className="text-white font-medium">Salvando veículo...</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PLACA */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="plate" className="text-sm font-semibold text-gray-200">
            Placa
          </label>
          <Input
            id="plate"
            name="plate"
            value={formData.plate}
            onChange={handleChange}
            placeholder="ABC1234"
            required
            className="bg-gray-800 border-gray-700 text-gray-100 rounded-md"
            maxLength={7}
          />
        </div>

        {/* FILIAL */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="branchId" className="text-sm font-semibold text-gray-200">
            Filial
          </label>
          <select
            name="branchId"
            className="bg-gray-800 border border-gray-700 p-2 rounded-md text-gray-100"
            value={formData.branchId}
            onChange={handleChange}
          >
            {branchs.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} - {branch.city}
              </option>
            ))}
          </select>
        </div>

        {/* MARCA */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="brand" className="text-sm font-semibold text-gray-200">
            Marca
          </label>
          <select
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={(e) => {
              handleChange(e)
              setFormData((prev) => ({ ...prev, model: "" })) // reseta modelo
            }}
            required
            className="bg-gray-800 border border-gray-700 p-2 rounded-md text-gray-100"
          >
            <option value="" disabled>Selecione a marca</option>
            <option value="HONDA">HONDA</option>
            <option value="YAMAHA">YAMAHA</option>
          </select>
        </div>

        {/* MODELO */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="model" className="text-sm font-semibold text-gray-200">
            Modelo
          </label>
          <select
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            disabled={!formData.brand}
            className="bg-gray-800 border border-gray-700 p-2 rounded-md text-gray-100"
          >
            <option value="" disabled>
              {formData.brand ? "Selecione um modelo" : "Escolha a marca primeiro"}
            </option>
            {formData.brand &&
              modelsByBrand[formData.brand].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
          </select>
        </div>

        {/* ANO MODELO */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="modelYear" className="text-sm font-semibold text-gray-200">
            Ano Modelo
          </label>
          <Input
            id="modelYear"
            name="modelYear"
            value={formData.modelYear}
            onChange={handleChange}
            placeholder="2022"
            required
            maxLength={4}
            className="bg-gray-800 border-gray-700 text-gray-100 rounded-md"
          />
        </div>

        {/* ANO FABRICAÇÃO */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="manufactureYear" className="text-sm font-semibold text-gray-200">
            Ano Fabricação
          </label>
          <Input
            id="manufactureYear"
            name="manufactureYear"
            value={formData.manufactureYear}
            onChange={handleChange}
            placeholder="2021"
            required
            maxLength={4}
            className="bg-gray-800 border-gray-700 text-gray-100 rounded-md"
          />
        </div>

        {/* COR (agora como SELECT fixo) */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="color" className="text-sm font-semibold text-gray-200">
            Cor
          </label>
          <select
            id="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            className="bg-gray-800 border border-gray-700 p-2 rounded-md text-gray-100"
          >
            <option value="" disabled>Selecione a cor</option>
            <option value="AZUL">AZUL</option>
            <option value="AMARELO">AMARELO</option>
            <option value="BRANCO">BRANCO</option>
            <option value="PRETO">PRETO</option>
            <option value="PRATA">PRATA</option>
            <option value="VERMELHO">VERMELHO</option>
            <option value="VERDE">VERDE</option>
          </select>
        </div>

        {/* STATUS */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="status" className="text-sm font-semibold text-gray-200">
            Status
          </label>
          <select
            name="status"
            className="bg-gray-800 border border-gray-700 p-2 rounded-md text-gray-100"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="AVAILABLE">Ativo</option>
            <option value="MAINTENANCE">Manutenção</option>
            <option value="UNAVAILABLE">Inativo</option>
          </select>
        </div>

        {/* RENAVAM */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="renavam" className="text-sm font-semibold text-gray-200">
            Renavam
          </label>
          <Input
            id="renavam"
            name="renavam"
            value={formData.renavam}
            onChange={handleChange}
            placeholder="Apenas números"
            required
            maxLength={11}
            className="bg-gray-800 border-gray-700 text-gray-100 rounded-md"
          />
        </div>

        {/* CHASSI */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="chassis" className="text-sm font-semibold text-gray-200">
            Chassi
          </label>
          <Input
            id="chassis"
            name="chassis"
            value={formData.chassis}
            onChange={handleChange}
            placeholder="9BRBL9BF1K0123456"
            required
            className="bg-gray-800 border-gray-700 text-gray-100 rounded-md"
          />
        </div>

        {/* ODOMETRO */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="mileageStart" className="text-sm font-semibold text-gray-200">
            Odômetro
          </label>
          <Input
            id="mileageStart"
            name="mileageStart"
            value={formData.mileageStart}
            onChange={handleChange}
            placeholder="10000"
            required
            maxLength={9}
            className="bg-gray-800 border-gray-700 text-gray-100 rounded-md"
          />
        </div>
      </div>

      {/* BOTÕES */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 rounded-md border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white transition disabled:opacity-50"
        >
          CANCELAR
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow transition flex items-center space-x-2 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          <span>{isLoading ? "Salvando..." : "SALVAR"}</span>
        </button>
      </div>
    </form>
  )
}