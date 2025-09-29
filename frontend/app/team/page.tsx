"use client"

import { useEffect, useState } from "react"
import { X, Search, Filter, UserPlus } from "lucide-react"
import type { User } from "@/types/types"
import { fetchClientSide } from "@/lib/utils/fetchClientSide"
import UserCard from "@/components/User/userCard"
import UserForm from "@/components/User/userForm"
import { UserRole } from "@/types/enums"

export default function TeamPage() {
  const [showForm, setShowForm] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<UserRole | "ALL">("ALL")
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const cachedUser = sessionStorage.getItem("user")
        if (cachedUser) {
          setCurrentUser(JSON.parse(cachedUser))
        } else {
          const userData = await fetchClientSide<User>("GET", "/auth/me")
          setCurrentUser(userData)
          sessionStorage.setItem("user", JSON.stringify(userData))
        }
      } catch (error) {
        console.error("Error fetching current user:", error)
      }
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const data = await fetchClientSide<User[]>("GET", `/users/`)
      setUsers(data)
    })()
  }, [])

  const filteredUsers = (): User[] => {
    let result = users

    if (searchTerm) {
      result = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (activeFilter !== "ALL") {
      result = users.filter((user) => user.role === activeFilter)
    }

    return result
  }

  const handleOpenForm = () => {
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
  }

  const handleAddUser = (user: User) => {
    // Simular adição de um novo usuário
    setUsers([
      ...users,
      {
        ...user,
        id: Date.now().toString(),
      },
    ])
    setShowForm(false)
  }

  const handleFilterChange = (filter: UserRole | "ALL") => {
    setActiveFilter(filter)
  }

  const canAddUsers = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.BRANCH_MANAGER

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Equipe</h1>
            <p className="text-gray-400 mt-1">Gerencie motoristas, administradores e gerentes de oficina</p>
          </div>
          {canAddUsers && (
            <button
              onClick={handleOpenForm}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Usuário
            </button>
          )}
        </header>

        {/* Barra de pesquisa e filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, email ou telefone..."
              className="bg-gray-900 border border-gray-800 text-gray-100 pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange("ALL")}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeFilter === "ALL" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => handleFilterChange(UserRole.DRIVER)}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeFilter === "DRIVER" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Motoristas
              </button>
              <button
                onClick={() => handleFilterChange(UserRole.ADMIN)}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeFilter === "ADMIN" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Administradores
              </button>
              <button
                onClick={() => handleFilterChange(UserRole.WORKSHOP_MANAGER)}
                className={`px-3 py-1 rounded-full text-sm ${
                  activeFilter === "WORKSHOP_MANAGER"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Gerentes de Oficina
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers().length > 0 ? (
            filteredUsers().map((user) => <UserCard key={user.id} user={user} />)
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-gray-400">
                {searchTerm || activeFilter !== "ALL"
                  ? "Nenhum usuário encontrado com os filtros aplicados."
                  : "Nenhum usuário cadastrado."}
              </p>
            </div>
          )}
        </div>

        {/* Modal do formulário */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Adicionar Novo Usuário</h2>
                  <button onClick={handleCloseForm} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <UserForm onSubmit={handleAddUser} onCancel={handleCloseForm} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
