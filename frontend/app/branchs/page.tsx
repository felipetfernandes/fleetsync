"use client";

import { useEffect, useState } from "react";
import { PlusCircle, X, Search, Filter, Building2, Car, Wrench, UserCircle, MapPin } from "lucide-react";
import { Branch } from "@/types/types";
import { fetchClientSide } from "@/lib/utils/fetchClientSide";
import Link from "next/link";
import { VehicleStatus } from "@/types/enums";

export default function BranchPage() {
  const [showForm, setShowForm] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  useEffect(() => {
    (async () => {
      const data = await fetchClientSide<Branch[]>("GET", `/branches/include=vehicles`);
      setBranches(data);
      setFilteredBranches(data);
    })();
  }, []);

  useEffect(() => {
    let result = branches;
    
    // Aplicar filtro de busca
    if (searchTerm) {
      result = result.filter(
        (branch) =>
          branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Aplicar filtro de cidade (se implementado)
    if (activeFilter !== "ALL") {
      result = result.filter((branch) => branch.city === activeFilter);
    }
    
    setFilteredBranches(result);
  }, [searchTerm, activeFilter, branches]);

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleAddBranch = (branch: Branch) => {
    setShowForm(false);
  };

  // Função para obter cidades únicas para filtro
  const getUniqueCities = () => {
    const cities = branches.map(branch => branch.city);
    return [...new Set(cities)];
  };

  // Função para calcular estatísticas de veículos por filial
  const getBranchVehicleStats = (branch: Branch) => {
    if (!branch.vehicles) return { available: 0, unavailable: 0, maintenance: 0, total: 0 };
    
    const available = branch.vehicles.filter(v => v.status === VehicleStatus.AVAILABLE).length;
    const unavailable = branch.vehicles.filter(v => v.status === VehicleStatus.UNAVAILABLE).length;
    const maintenance = branch.vehicles.filter(v => v.status === VehicleStatus.MAINTENANCE).length;
    
    return {
      available,
      unavailable,
      maintenance,
      total: branch.vehicles.length
    };
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Filiais</h1>
            <p className="text-gray-400 mt-1">
              Gerencie as filiais da empresa e seus recursos
            </p>
          </div>
          <button
            onClick={handleOpenForm}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-gray-100 p-2 rounded text-sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Filial
          </button>
        </header>

        {/* Barra de pesquisa e filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome ou cidade..."
              className="bg-gray-900 border border-gray-800 text-gray-100 pl-10 pr-4 py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {getUniqueCities().length > 1 && (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter("ALL")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    activeFilter === "ALL"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  Todas as cidades
                </button>
                {getUniqueCities().map(city => (
                  <button
                    key={city}
                    onClick={() => setActiveFilter(city)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      activeFilter === city
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Formulário de nova filial (modal) */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    Adicionar Nova Filial
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {/* Aqui entraria o componente BranchForm */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Nome da Filial
                    </label>
                    <input
                      type="text"
                      className="bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Nome da filial"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      className="bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Cidade"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Endereço
                    </label>
                    <input
                      type="text"
                      className="bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Endereço completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Gerente Responsável
                    </label>
                    <select
                      className="bg-gray-800 border border-gray-700 text-gray-100 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Selecione um gerente</option>
                      {/* Opções de gerentes seriam carregadas aqui */}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={handleCloseForm}
                      className="px-4 py-2 border border-gray-700 text-gray-300 rounded hover:bg-gray-800"
                    >
                      Cancelar
                    </button>
                    <button
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de filiais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.length > 0 ? (
            filteredBranches.map((branch) => {
              const stats = getBranchVehicleStats(branch);
              
              return (
                <Link
                  href={`/branch/${branch.id}`}
                  key={branch.id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors block"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 mr-2 text-indigo-400" />
                        <h3 className="text-lg font-medium">{branch.name}</h3>
                      </div>
                      <p className="text-gray-400 mt-1 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {branch.city}
                      </p>
                    </div>
                    {branch.users?.find(user => user.role === "BRANCH_MANAGER") && (
                      <div className="bg-gray-800 rounded-full p-1">
                        <UserCircle className="h-6 w-6 text-indigo-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Total de veículos</span>
                      <span className="font-medium flex items-center">
                        <Car className="h-4 w-4 mr-1 text-gray-400" />
                        {stats.total}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-gray-800 rounded-md p-2">
                        <p className="text-xs text-gray-400">Disponíveis</p>
                        <p className="font-medium text-emerald-400">{stats.available}</p>
                      </div>
                      <div className="bg-gray-800 rounded-md p-2">
                        <p className="text-xs text-gray-400">Indisponíveis</p>
                        <p className="font-medium text-rose-400">{stats.unavailable}</p>
                      </div>
                      <div className="bg-gray-800 rounded-md p-2">
                        <p className="text-xs text-gray-400">Manutenção</p>
                        <p className="font-medium text-amber-400">{stats.maintenance}</p>
                      </div>
                    </div>
                    
                    {branch.workshops && branch.workshops.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Oficinas parceiras</span>
                        <span className="font-medium flex items-center">
                          <Wrench className="h-4 w-4 mr-1 text-gray-400" />
                          {branch.workshops.length}
                        </span>
                      </div>
                    )}
                    
                    {branch.users && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Motoristas</span>
                        <span className="font-medium flex items-center">
                          <UserCircle className="h-4 w-4 mr-1 text-gray-400" />
                          {branch.users.filter(user => user.role === "DRIVER").length}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-gray-400">
                {searchTerm || activeFilter !== "ALL"
                  ? "Nenhuma filial encontrada com os filtros aplicados."
                  : "Nenhuma filial cadastrada."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
