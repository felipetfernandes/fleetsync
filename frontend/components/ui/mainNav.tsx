"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  Wrench,
  ClipboardList,
  BarChart3,
  LogOut,
  User,
  Settings,
  Bell,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

// Dados do usuário (simulados)
const userData = {
  name: "Carlos Silva",
  email: "carlos.silva@empresa.com",
  role: "Gerente de Frota",
  avatar: "/placeholder.svg?height=40&width=40",
  notifications: 3,
};

// Links de navegação
const navLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Frota",
    href: "/fleet",
    icon: Car,
  },
  {
    title: "Oficinas",
    href: "/workshops",
    icon: Wrench,
  },
  {
    title: "Ordens de Serviço",
    href: "/orders",
    icon: ClipboardList,
  },
];

export function MainNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Lógica de logout aqui
    console.log("Logout realizado");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-gray-950">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-6 w-6 text-indigo-400" />
            <span className="text-xl font-bold text-white">GestãoFrota</span>
          </Link>

          {/* Menu de navegação para desktop */}
          <nav className="hidden md:flex items-center gap-6 ml-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
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
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Botão de notificações           
            <button className="relative text-gray-400 hover:text-white">
                <Bell className="h-5 w-5" />
                {userData.notifications > 0 && (
                <p className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-indigo-600">
                    {userData.notifications}
                </p>
                )}
            </button>
          */}

          {/* Menu do usuário
            <div>
            <div>
              <button className="flex items-center gap-2 px-2 hover:bg-gray-800 hover:text-white">
                <div className="h-8 w-8 border border-gray-700">
                  <Image
                    src={userData.avatar || "/placeholder.svg"}
                    alt={userData.name}
                    width={40}
                    height={40}
                  />
                  <div className="bg-gray-800 text-white">
                    {userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-white">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-400">{userData.role}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div className="w-56 bg-gray-900 border-gray-800 text-gray-100">
              <div>Minha Conta</div>
              <div className="bg-gray-800" />
              <div className="hover:bg-gray-800 cursor-pointer">
                <User className="mr-2 h-4 w-4 text-indigo-400" />
                <span>Perfil</span>
              </div>
              <div className="hover:bg-gray-800 cursor-pointer">
                <Settings className="mr-2 h-4 w-4 text-indigo-400" />
                <span>Configurações</span>
              </div>
              <div className="bg-gray-800" />
              <div
                className="hover:bg-gray-800 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4 text-rose-500" />
                <span>Sair</span>
              </div>
            </div>
            </div>          
          */}

          {/* Menu mobile 
            <div>
                    <div>
                      <button className="md:hidden text-gray-400 hover:text-white">
                        <Menu className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="w-[80%] sm:w-[350px] bg-gray-900 border-gray-800 text-gray-100 p-0">
                      <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4 border-b border-gray-800">
                          <div className="flex items-center gap-2">
                            <Car className="h-6 w-6 text-indigo-400" />
                            <span className="text-xl font-bold text-white">
                              GestãoFrota
                            </span>
                          </div>
                          <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-gray-400 hover:text-white"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
        
                        <div className="flex flex-col p-4 border-b border-gray-800">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-10 w-10 border border-gray-700">
                              <Image
                                src={userData.avatar || "/placeholder.svg"}
                                alt={userData.name}
                                width={40}
                                height={40}
                              />
                              <div className="bg-gray-800 text-white">
                                {userData.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-white">{userData.name}</p>
                              <p className="text-sm text-gray-400">{userData.role}</p>
                            </div>
                          </div>
                        </div>
        
                        <nav className="flex-1 overflow-auto py-4">
                          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Navegação
                          </div>
                          {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-800 ${
                                  isActive ? "bg-gray-800 text-white" : "text-gray-300"
                                }`}
                              >
                                <link.icon className="h-5 w-5 text-indigo-400" />
                                {link.title}
                              </Link>
                            );
                          })}
                        </nav>
        
                        <div className="p-4 border-t border-gray-800">
                          <button
                            className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
                            onClick={handleLogout}
                          >
                            <LogOut className="mr-2 h-5 w-5 text-rose-500" />
                            Sair
                          </button>
                        </div>
                      </div>
                    </div>
            </div>                  
          */}
        </div>
      </div>
    </header>
  );
}
