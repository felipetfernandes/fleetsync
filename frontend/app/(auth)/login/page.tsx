import React from "react";

import Button from "@/components/ui/button";
import SupportButton from "@/components/ui/supportButton";
import Image from "next/image";
import Input from "@/components/ui/input";

const truckImage = "/images/truck.svg";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center bg-gray-800 p-4 rounded-md">
        <Image src={truckImage} alt="logo" width={100} height={100} />
        <h1 className="text-gray-300 text-2xl">Fleet Manager</h1>
        <h3 className="text-gray-500 text-xs mb-4">
          Sistema de Gerenciamento de Frota
        </h3>
        <form action="" className="flex flex-col gap-2">
          <span className="text-gray-300 text-sm">Email</span>
          <Input type="email" placeholder="seu@email.com" />
          <span className="text-gray-300 text-sm">Senha</span>
          <Input type="password" placeholder="********" />
          <Button type="submit" className="mt-4">Entrar</Button>
          <SupportButton>Contatar Suporte</SupportButton>
        </form>
      </div>
    </div>
  );
}
