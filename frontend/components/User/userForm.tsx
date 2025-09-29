"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import type { Branch, User, Workshop, Vehicle } from "@/types/types"
import { fetchClientSide } from "@/lib/utils/fetchClientSide"

const roleNames = {
  ADMIN: "Administrador",
  DRIVER: "Motorista",
  WORKSHOP_MANAGER: "Gerente de Oficina",
  BRANCH_MANAGER: "Gerente de Filial",
}

interface UserEditFormProps {
  user: User
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function UserEditForm({ user, onSubmit, onCancel }: UserEditFormProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    branchId: user.branchId?.toString() || "",
    licenseNumber: user.licenseNumber || "",
    licenseCategory: user.licenseCategory || "",
    licenseExpiration: user.licenseExpiration ? new Date(user.licenseExpiration).toISOString().split("T")[0] : "",
    workshopId: user.workshop?.id || "",
    vehicleId: user.vehicle?.id || "",
  })

  const [branches, setBranches] = useState<Branch[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const data = await fetchClientSide<Branch[]>("GET", "/branchs")
        setBranches(data)
      } catch (error) {
        console.error("Erro ao buscar filiais:", error)
      }
    }

    fetchBranches()
  }, [])

  useEffect(() => {
    if (formData.role === "WORKSHOP_MANAGER" && formData.branchId) {
      const fetchWorkshops = async () => {
        try {
          const data = await fetchClientSide<Workshop[]>("GET", `/workshops?branchId=${formData.branchId}`)
          setWorkshops(data)
        } catch (error) {
          console.error("Erro ao buscar oficinas:", error)
        }
      }

      fetchWorkshops()
    }
  }, [formData.role, formData.branchId])

  useEffect(() => {
    if (formData.role === "DRIVER" && formData.branchId) {
      const fetchVehicles = async () => {
        try {
          const data = await fetchClientSide<Vehicle[]>(
            "GET",
            `/vehicles?branchId=${formData.branchId}&status=AVAILABLE`,
          )
          setVehicles(data)
        } catch (error) {
          console.error("Erro ao buscar veículos:", error)
        }
      }

      fetchVehicles()
    }
  }, [formData.role, formData.branchId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  try {
    // Preparar dados do usuário (sem workshopId e vehicleId)
    const updateData: any = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      branchId: formData.branchId ? Number.parseInt(formData.branchId) : null,
    }

    // Adicionar campos específicos para motoristas
    if (formData.role === "DRIVER") {
      updateData.licenseNumber = formData.licenseNumber || null
      updateData.licenseCategory = formData.licenseCategory || null
      updateData.licenseExpiration = formData.licenseExpiration ? new Date(formData.licenseExpiration).toISOString() : null
    }

    // Obter o companyId da branch selecionada
    if (formData.branchId) {
      const selectedBranch = branches.find(branch => branch.id === Number(formData.branchId))
      if (selectedBranch) {
        updateData.companyId = selectedBranch.companyId
      }
    }

    // Atualizar usuário (sem workshopId/vehicleId)
    const response = await fetchClientSide("PATCH", `/users/${user.id}`, updateData)

    // Gerenciar vinculação de oficina para WORKSHOP_MANAGER
    if (formData.role === "WORKSHOP_MANAGER") {
      // Se tinha oficina antes e mudou ou removeu
      if (user.workshop?.id && user.workshop.id !== formData.workshopId) {
        // Desvincular da oficina anterior
        await fetchClientSide("PATCH", `/workshops/${user.workshop.id}/manager`, {
          managerId: null
        })
      }

      // Se selecionou uma nova oficina
      if (formData.workshopId) {
        await fetchClientSide("PATCH", `/workshops/${formData.workshopId}/manager`, {
          managerId: user.id
        })
      }
    }

    // Gerenciar vinculação de veículo para DRIVER
    if (formData.role === "DRIVER") {
      // Se tinha veículo antes e mudou ou removeu
      if (user.vehicle?.id && user.vehicle.id !== formData.vehicleId) {
        // Desvincular do veículo anterior
        await fetchClientSide("PATCH", `/vehicles/${user.vehicle.id}/driver`, {
          driverId: null
        })
      }

      // Se selecionou um novo veículo
      if (formData.vehicleId) {
        await fetchClientSide("PATCH", `/vehicles/${formData.vehicleId}/driver`, {
          driverId: user.id
        })
      }
    }

    // Se mudou de role, limpar vinculações antigas
    if (user.role !== formData.role) {
      // Se era WORKSHOP_MANAGER e tinha oficina
      if (user.role === "WORKSHOP_MANAGER" && user.workshop?.id) {
        await fetchClientSide("PATCH", `/workshops/${user.workshop.id}/manager`, {
          managerId: null
        })
      }

      // Se era DRIVER e tinha veículo
      if (user.role === "DRIVER" && user.vehicle?.id) {
        await fetchClientSide("PATCH", `/vehicles/${user.vehicle.id}/driver`, {
          driverId: null
        })
      }
    }

    onSubmit(response)
  } catch (error: any) {
    console.error("Erro ao atualizar usuário:", error)
    alert("Erro ao atualizar usuário: " + (error.message || "Erro desconhecido"))
  } finally {
    setLoading(false)
  }
}

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 rounded-lg w-full max-h-[90vh] overflow-y-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-300">
            Nome Completo
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nome completo"
            className="bg-gray-800 border-gray-700"
            required
          />
        </div>

        {/* Email */}
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
            placeholder="email@exemplo.com"
            className="bg-gray-800 border-gray-700"
            required
          />
        </div>

        {/* Telefone */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-gray-300">
            Telefone
          </label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+5511987654321"
            className="bg-gray-800 border-gray-700"
            required
          />
        </div>

        {/* Função */}
        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium text-gray-300">
            Função
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 p-2 rounded border w-full"
            required
          >
            {Object.entries(roleNames).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>

        {/* Filial */}
        <div className="space-y-2">
          <label htmlFor="branchId" className="text-sm font-medium text-gray-300">
            Filial
          </label>
          <select
            id="branchId"
            name="branchId"
            value={formData.branchId}
            onChange={handleChange}
            className="bg-gray-800 border-gray-700 p-2 rounded border w-full"
            required
          >
            <option value="">Selecione uma filial</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} - {branch.city}
              </option>
            ))}
          </select>
        </div>

        {formData.role === "WORKSHOP_MANAGER" && (
          <div className="space-y-2">
            <label htmlFor="workshopId" className="text-sm font-medium text-gray-300">
              Oficina
            </label>
            <select
              id="workshopId"
              name="workshopId"
              value={formData.workshopId}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 p-2 rounded border w-full"
            >
              <option value="">Selecione uma oficina</option>
              {workshops.map((workshop) => (
                <option key={workshop.id} value={workshop.id}>
                  {workshop.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.role === "DRIVER" && (
          <div className="space-y-2">
            <label htmlFor="vehicleId" className="text-sm font-medium text-gray-300">
              Veículo
            </label>
            <select
              id="vehicleId"
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 p-2 rounded border w-full"
            >
              <option value="">Selecione um veículo</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.plate} - {vehicle.brand} {vehicle.model}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Campos específicos para motoristas */}
      {formData.role === "DRIVER" && (
        <div className="space-y-4 border-t border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-white">Informações da CNH</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Número da CNH */}
            <div className="space-y-2">
              <label htmlFor="licenseNumber" className="text-sm font-medium text-gray-300">
                Número da CNH
              </label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                placeholder="12345678900"
                className="bg-gray-800 border-gray-700"
              />
            </div>

            {/* Categoria da CNH */}
            <div className="space-y-2">
              <label htmlFor="licenseCategory" className="text-sm font-medium text-gray-300">
                Categoria da CNH
              </label>
              <select
                id="licenseCategory"
                name="licenseCategory"
                value={formData.licenseCategory}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700 p-2 rounded border w-full"
              >
                <option value="">Selecione</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="AB">AB</option>
                <option value="AC">AC</option>
                <option value="AD">AD</option>
                <option value="AE">AE</option>
              </select>
            </div>

            {/* Validade da CNH */}
            <div className="space-y-2">
              <label htmlFor="licenseExpiration" className="text-sm font-medium text-gray-300">
                Validade da CNH
              </label>
              <Input
                id="licenseExpiration"
                name="licenseExpiration"
                type="date"
                value={formData.licenseExpiration}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* Botões */}
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
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  )
}
