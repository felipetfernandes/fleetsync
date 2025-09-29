"use client"

import type { User } from "@/types/types"
import { UserRole } from "@/types/enums"
import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

// Helper functions to get role display name and colors
function getRoleDisplay(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return "Administrador"
    case UserRole.BRANCH_MANAGER:
      return "Gerente de Filial"
    case UserRole.WORKSHOP_MANAGER:
      return "Gerente de Oficina"
    case UserRole.DRIVER:
      return "Motorista"
    default:
      return role
  }
}

function getRoleColors(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return "bg-purple-900/30 text-purple-400"
    case UserRole.BRANCH_MANAGER:
      return "bg-emerald-900/30 text-emerald-400"
    case UserRole.WORKSHOP_MANAGER:
      return "bg-amber-900/30 text-amber-400"
    case UserRole.DRIVER:
      return "bg-blue-900/30 text-blue-400"
    default:
      return "bg-gray-900/30 text-gray-400"
  }
}

function UserMenu({
  user,
  handleLogout,
}: {
  user: User
  handleLogout: () => void
}) {
  const [opened, setOpened] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpened(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={menuRef} className="relative">
      <div>
        <button
          className="flex items-center gap-2 p-2 rounded-xl border border-transparent hover:bg-gray-800 hover:text-white hover:border-indigo-400"
          onClick={() => setOpened(!opened)}
        >
          <UserRound className="h-8 w-8 text-indigo-400" />
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getRoleColors(user.role)}`}>
              {getRoleDisplay(user.role)}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      {opened && (
        <div className="w-56 bg-gray-900 border border-gray-800 text-gray-100 text-sm font-normal absolute top-14 rounded-2xl p-4">
          <div className="border-b pb-2 border-gray-800">Minha Conta</div>
          <Link href="/profile" onClick={() => setOpened(false)}>
            <div className="flex items-center gap-2 p-2 hover:bg-gray-800 cursor-pointer">
              <UserRound className="mr-2 h-4 w-4 text-indigo-400" />
              <span>Perfil</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 p-2 hover:bg-gray-800 cursor-pointer">
            <Settings className="mr-2 h-4 w-4 text-indigo-400" />
            <span>Configurações</span>
          </div>
          <div
            className="flex items-center gap-2 border-t p-2 border-gray-800 hover:bg-gray-800 cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4 text-rose-500" />
            <span>Sair</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
