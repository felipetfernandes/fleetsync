import React from "react";

import Button from "@/components/ui/button";
import SupportButton from "@/components/ui/supportButton";
import Image from "next/image";
import Input from "@/components/ui/input";
import { redirect } from "next/navigation";

const LogoImage = "/images/logo2.png";

async function handleLogin(formData: FormData) {
  "use server";

  // Aqui você pode validar os dados, autenticar, etc.
  const email = formData.get("email");
  const password = formData.get("password");

  // Depois redirecionar
  redirect("/fleet");
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="flex flex-col items-center justify-center text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
        <Image src={LogoImage} width={150} height={150} alt="Logo" className="mb-6"/>
        <h1 className="text-gray-300 text-2xl">Fleet Manager</h1>
        <h3 className="text-gray-500 text-xs mb-4">
          Sistema de Gerenciamento de Frota
        </h3>
        <form action={handleLogin} className="flex flex-col gap-2">
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
