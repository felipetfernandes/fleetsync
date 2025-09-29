"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import type { Branch, Workshop, Vehicle } from "@/types/types"
import { fetchClientSide } from "@/lib/utils/fetchClientSide"
import { Loader2 } from "lucide-react"

const roleNames = {
  ADMIN: "Administrador",
  DRIVER: "Motorista",
  WORKSHOP_MANAGER: "Gerente de Oficina",
  BRANCH_MANAGER: "Gerente de Filial",
}

interface UserFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function UserForm({ onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "DRIVER" as keyof typeof roleNames,
    branchId: "",
    workshopId: "",
    vehicleId: "",
    licenseNumber: "",
    licenseCategory: "",
    licenseExpiration: "",
  })

  const [branches, setBranches] = useState<Branch[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
          setWorkshops(data.filter((w) => !w.managerId)) // Apenas oficinas sem gerente
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
          const data = await fetchClientSide<Vehicle[]>("GET", `/vehicles?branchId=${formData.branchId}`)
          setVehicles(data.filter((v) => !v.driverId)) // Apenas veículos sem motorista
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

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não são iguais")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      setLoading(false)
      return
    }

    try {
      const { confirmPassword, workshopId, vehicleId, ...userData } = formData

      const createData: any = {
        ...userData,
        phone: formData.phone.replace(/\D/g, ""), // Remove formatação do telefone
        branchId: formData.branchId ? Number.parseInt(formData.branchId) : undefined,
      }

      // Adicionar campos específicos para motoristas
      if (formData.role === "DRIVER") {
        createData.licenseNumber = formData.licenseNumber || undefined
        createData.licenseCategory = formData.licenseCategory || undefined
        createData.licenseExpiration = formData.licenseExpiration ? new Date(formData.licenseExpiration) : undefined
      }

      const response = await fetchClientSide("POST", "/users", createData)

      // Se for gerente de oficina, vincular à oficina
      if (formData.role === "WORKSHOP_MANAGER" && workshopId) {
        await fetchClientSide("PATCH", `/workshops/${workshopId}`, {
          managerId: response.id,
        })
      }

      // Se for motorista, vincular ao veículo
      if (formData.role === "DRIVER" && vehicleId) {
        await fetchClientSide("PATCH", `/vehicles/${vehicleId}`, {
          driverId: response.id,
        })
      }

      onSubmit(response)
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error)
      setError("Erro ao criar usuário: " + (error.message || "Erro desconhecido"))
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
            <span className="text-white">Criando usuário...</span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-900 rounded-lg w-full max-h-[90vh] overflow-y-auto p-6"
      >
        {error && <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded">{error}</div>}

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
              disabled={loading}
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
              disabled={loading}
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
              onChange={handlePhoneChange}
              placeholder="(11) 98765-4321"
              className="bg-gray-800 border-gray-700"
              required
              disabled={loading}
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
              disabled={loading}
            >
              {Object.entries(roleNames).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Senha */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-300">
              Senha
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-gray-800 border-gray-700"
              required
              disabled={loading}
            />
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
              Confirmar Senha
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-gray-800 border-gray-700"
              required
              disabled={loading}
            />
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
              disabled={loading}
            >
              <option value="">Selecione uma filial</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} - {branch.city}
                </option>
              ))}
            </select>
          </div>

          {/* Oficina (apenas para WORKSHOP_MANAGER) */}
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
                disabled={loading || !formData.branchId}
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

          {/* Veículo (apenas para DRIVER) */}
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
                disabled={loading || !formData.branchId}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center space-x-2"
            disabled={loading}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{loading ? "Criando..." : "Criar Usuário"}</span>
          </button>
        </div>
      </form>
    </>
  )
}
