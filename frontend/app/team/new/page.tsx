"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import type { Branch, Workshop, Vehicle } from "@/types/types"
import { fetchClientSide } from "@/lib/utils/fetchClientSide"

const roleNames = {
  ADMIN: "Administrador",
  DRIVER: "Motorista",
  WORKSHOP_MANAGER: "Gerente de Oficina",
  BRANCH_MANAGER: "Gerente de Filial",
}

export default function NewUserPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "DRIVER",
    branchId: "",
    licenseNumber: "",
    licenseCategory: "",
    licenseExpiration: "",
    workshopId: "",
    vehicleId: "",
  })

  const [branches, setBranches] = useState<Branch[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(false)
  const [passwordError, setPasswordError] = useState("")

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

    if (name === "password" || name === "confirmPassword") {
      setPasswordError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("As senhas não coincidem")
      return
    }

    setLoading(true)

    try {
      const createData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        branchId: formData.branchId ? Number.parseInt(formData.branchId) : null,
      }

      if (formData.role === "DRIVER") {
        createData.licenseNumber = formData.licenseNumber || null
        createData.licenseCategory = formData.licenseCategory || null
        createData.licenseExpiration = formData.licenseExpiration
          ? new Date(formData.licenseExpiration).toISOString()
          : null
      }

      if (formData.branchId) {
        const selectedBranch = branches.find((branch) => branch.id === Number(formData.branchId))
        if (selectedBranch) {
          createData.companyId = selectedBranch.companyId
        }
      }

      const newUser = await fetchClientSide("POST", "/users", createData)

      if (formData.role === "WORKSHOP_MANAGER" && formData.workshopId) {
        await fetchClientSide("PATCH", `/workshops/${formData.workshopId}/manager`, {
          managerId: newUser.id,
        })
      }

      if (formData.role === "DRIVER" && formData.vehicleId) {
        await fetchClientSide("PATCH", `/vehicles/${formData.vehicleId}/driver`, {
          driverId: newUser.id,
        })
      }

      router.push(`/team/${newUser.id}`)
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error)
      alert("Erro ao criar usuário: " + (error.message || "Erro desconhecido"))
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Adicionar Novo Usuário</h1>
            <button onClick={handleCancel} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Senha"
                  className="bg-gray-800 border-gray-700"
                  required
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
                  placeholder="Confirme a senha"
                  className={`bg-gray-800 border-gray-700 ${passwordError ? "border-red-500" : ""}`}
                  required
                />
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
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

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
              <button
                type="button"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white px-4 py-2 border rounded"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Criando..." : "Criar Usuário"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
