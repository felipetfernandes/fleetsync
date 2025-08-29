"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, Wrench, ClipboardList, BarChart3, LogOut, Menu, X, Users, Building2 } from "lucide-react"
import Image from "next/image"
import UserMenu from "../User/userMenu"
import type { User } from "@/types/types"
import { fetchClientSide } from "@/lib/utils/fetchClientSide"
import { UserRole } from "@/types/enums"

// Links de navegação
const navLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Filiais",
    href: "/branchs",
    icon: Building2,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Frota",
    href: "/fleet",
    icon: Car,
    roles: [UserRole.ADMIN, UserRole.BRANCH_MANAGER],
  },
  {
    title: "Oficinas",
    href: "/workshops",
    icon: Wrench,
    roles: [UserRole.ADMIN, UserRole.BRANCH_MANAGER],
  },
  {
    title: "Ordens de Serviço",
    href: "/orders",
    icon: ClipboardList,
    roles: [UserRole.ADMIN, UserRole.BRANCH_MANAGER, UserRole.WORKSHOP_MANAGER],
  },
  {
    title: "Time",
    href: "/team",
    icon: Users,
    roles: [UserRole.ADMIN, UserRole.BRANCH_MANAGER, UserRole.WORKSHOP_MANAGER],
  },
]

export function MainNav() {
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [previousPath, setPreviousPath] = useState<string>("")

  const handleLogout = async () => {
    try {
      await fetchClientSide<User>("POST", "/auth/logout")
      sessionStorage.removeItem('user')
      window.location.href = "/login"
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      // Skip user fetch on login page
      if (pathname === "/login") {
        setIsLoading(false)
        return
      }
      
      // Só busca se veio da página de login OU se não tem usuário
      if (previousPath !== "/login" && user) {
        setIsLoading(false)
        return
      }
      
      const cachedUser = sessionStorage.getItem('user')
      if (cachedUser) {
        setUser(JSON.parse(cachedUser))
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const data = await fetchClientSide<User>("GET", "/auth/me")
        setUser(data)
        sessionStorage.setItem('user', JSON.stringify(data))
      } catch (error) {
        console.error("Error fetching user:", error)
        window.location.href = "/login"
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
    setPreviousPath(pathname)
  }, [pathname, user, previousPath])

  // Fecha o menu mobile quando a rota muda
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  if (isLoading && pathname !== "/login") {
    return (
      <header className="flex justify-center top-0 z-40 w-full border-b border-gray-800 bg-gray-950">
        <div className="container flex h-16 w-3/4 items-center justify-center px-4 md:px-6">
          <div className="animate-pulse flex items-center gap-2">
            <Car className="h-6 w-6 text-indigo-400" />
            <span className="text-xl font-bold text-white">GestãoFrota</span>
          </div>
        </div>
      </header>
    )
  }

  // Não mostra a navegação na página de login
  if (pathname === "/login") {
    return null
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-950">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Car className="h-6 w-6 text-indigo-400" />
              <span className="text-xl font-bold text-white">GestãoFrota</span>
            </Link>

            {/* Menu de navegação para desktop */}
            {user && (
              <nav className="hidden md:flex items-center gap-6 ml-6">
                {navLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href)
                  if (!link.roles.includes(user.role!)) {
                    return null
                  }
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center text-sm font-medium transition-colors hover:text-white ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    >
                      <link.icon className="mr-2 h-4 w-4" />
                      {link.title}
                    </Link>
                  )
                })}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                {/* UserMenu para desktop */}
                <div className="hidden md:block">
                  <UserMenu user={user} handleLogout={handleLogout} />
                </div>

                {/* Botão menu mobile */}
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden text-gray-400 hover:text-white"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Menu mobile overlay */}
      {mobileMenuOpen && user && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu lateral */}
          <aside className="fixed inset-y-0 right-0 w-[280px] bg-gray-900 border-l border-gray-800 z-50 md:hidden">
            <div className="flex flex-col h-full">
              {/* Header do menu */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Car className="h-6 w-6 text-indigo-400" />
                  <span className="text-xl font-bold text-white">GestãoFrota</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Informações do usuário */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  {user.avatar ? (
                    <Image 
                      src={user.avatar} 
                      alt={user.name} 
                      width={40} 
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-white">{user.name}</p>
                    <p className="text-sm text-gray-400">
                      {user.role === UserRole.ADMIN && "Administrador"}
                      {user.role === UserRole.BRANCH_MANAGER && "Gerente de Filial"}
                      {user.role === UserRole.WORKSHOP_MANAGER && "Gerente de Oficina"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Links de navegação */}
              <nav className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Navegação
                </div>
                {navLinks.map((link) => {
                  const isActive = pathname.startsWith(link.href)
                  if (!link.roles.includes(user.role!)) {
                    return null
                  }
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-800 ${
                        isActive 
                          ? "bg-gray-800 text-white border-l-2 border-indigo-400" 
                          : "text-gray-300"
                      }`}
                    >
                      <link.icon className={`h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-gray-400'}`} />
                      {link.title}
                    </Link>
                  )
                })}
              </nav>

              {/* Botão de logout */}
              <div className="p-4 border-t border-gray-800">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors rounded-md"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 text-rose-500" />
                  Sair
                </button>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  )
}                