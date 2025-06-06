"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  Wrench,
  ClipboardList,
  BarChart3,
  LogOut,
  Menu,
  X,
  Users,
  Building2,
} from "lucide-react";
import Image from "next/image";
import UserMenu from "../User/userMenu";
import { User } from "@/types/types";
import { fetchClientSide } from "@/lib/utils/fetchClientSide";
import { UserRole } from "@/types/enums";

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
    roles: [UserRole.ADMIN, UserRole.WORKSHOP_MANAGER, UserRole.BRANCH_MANAGER],
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
];

export function MainNav() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    console.log("Logout");
    await fetchClientSide<User>("POST", "/auth/logout");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchUser = async () => {
      const data = await fetchClientSide<User>("GET", "/auth/me");
      setUser(data);
    };

    if (pathname !== "/login") {
      fetchUser();
    }
  }, []);

  return (
    <>
      {pathname !== "/login" && (
        <header className="flex justify-center top-0 z-40 w-full border-b border-gray-800 bg-gray-950">
          <div className="container flex h-16 w-3/4 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Car className="h-6 w-6 text-indigo-400" />
                <span className="text-xl font-bold text-white">
                  GestãoFrota
                </span>
              </Link>

              {/* Menu de navegação para desktop */}
              <nav className="hidden md:flex items-center gap-6 ml-6">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  if (!link.roles.includes(user?.role!)) {
                    return null;
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
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Botão de notificações           
                <button className="relative text-gray-400 hover:text-white">
                    <Bell className="h-5 w-5" />
                    {user.notifications > 0 && (
                    <p className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-indigo-600">
                        {user.notifications}
                    </p>
                    )}
                </button>
              */}

              {user && <UserMenu user={user} handleLogout={handleLogout} />}

              {/* Menu mobile*/}
              {mobileMenuOpen && user && (
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
                              src={"/placeholder.svg"}
                              alt={user.name}
                              width={40}
                              height={40}
                            />
                            <div className="bg-gray-800 text-white">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-400">{user.role}</p>
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
                                isActive
                                  ? "bg-gray-800 text-white"
                                  : "text-gray-300"
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
              )}
            </div>
          </div>
        </header>
      )}
    </>
  );
}
