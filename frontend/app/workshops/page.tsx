"use client"

import { useEffect, useState } from "react"
import { PlusCircle, X } from "lucide-react"
import WorkshopForm from "@/components/Workshops/workshopForm"
import WorkshopCard from "@/components/Workshops/workshopCard"
import type { Workshop, User } from "@/types/types"
import { fetchClientSide } from "@/lib/utils/fetchClientSide"
import { UserRole } from "@/types/enums"

export default function WorkshopsPage() {
  const [showForm, setShowForm] = useState(false)
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // ⭐ CARREGA USUÁRIO E WORKSHOPS EM SEQUÊNCIA
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // 1. Busca o usuário (do JWT no cookie)
        const userData = await fetchClientSide<User>("GET", "/users/me")
        setCurrentUser(userData)
        
        // 2. Busca as oficinas (backend já filtra por role)
        const workshopsData = await fetchClientSide<Workshop[]>("GET", "/workshops")
        setWorkshops(workshopsData)
        
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleAddWorkshop = async () => {
    setShowForm(false)
    
    // Recarrega apenas as oficinas
    const workshopsData = await fetchClientSide<Workshop[]>("GET", "/workshops")
    setWorkshops(workshopsData)
  }

  const canAddWorkshop = 
    currentUser?.role === UserRole.ADMIN || 
    currentUser?.role === UserRole.BRANCH_MANAGER

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 p-6 flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Oficinas Cadastradas</h1>
            <p className="text-gray-400 mt-1">
              Gerencie as oficinas parceiras e acompanhe as manutenções
            </p>
            <p className="text-xs text-gray-600 mt-2">
              {currentUser?.role} | {workshops.length} oficina(s)
            </p>
          </div>
          {canAddWorkshop && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Oficina
            </button>
          )}
        </header>

        {showForm ? (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Adicionar Nova Oficina</h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <WorkshopForm onSubmit={handleAddWorkshop} onCancel={() => setShowForm(false)} />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-6">
            {workshops.length === 0 ? (
              <p className="text-gray-400 col-span-2 text-center py-8">
                Nenhuma oficina encontrada
              </p>
            ) : (
              workshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}