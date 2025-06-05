"use client";

import { User } from "@/types/types";
import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

function UserMenu({
  user,
  handleLogout,
}: {
  user: User;
  handleLogout: () => void;
}) {
  const [opened, setOpened] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpened(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            <p className="text-xs text-gray-400">{user.role}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
      </div>
      {opened && (
        <div className="w-56 bg-gray-900 border border-gray-800 text-gray-100 text-sm font-normal absolute top-14 rounded-2xl p-4">
          <div className="border-b pb-2 border-gray-800">Minha Conta</div>
          <div className="flex items-center gap-2 p-2 hover:bg-gray-800 cursor-pointer">
            <UserRound className="mr-2 h-4 w-4 text-indigo-400" />
            <span>Perfil</span>
          </div>
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
  );
}

export default UserMenu;
