"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import SupportButton from "@/components/ui/supportButton";
import Image from "next/image";
import { LOCAL_URL } from "@/lib/constants";

const LogoImage = "/images/logo2.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch(`api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      router.push("/dashboard");
    } else {
      alert("Login inválido");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="flex flex-col items-center justify-center text-gray-100 bg-gray-900 border border-gray-800 p-8 rounded-2xl">
        <Image src={LogoImage} width={150} height={150} alt="Logo" className="mb-6"/>
        <h1 className="text-gray-300 text-2xl">Fleet Manager</h1>
        <h3 className="text-gray-500 text-xs mb-4">
          Sistema de Gerenciamento de Frota
        </h3>
        <form onSubmit={handleLogin} className="flex flex-col gap-2">
          <span className="text-gray-300 text-sm">Email</span>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <span className="text-gray-300 text-sm">Senha</span>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" className="mt-4">Entrar</Button>
          <SupportButton>Contatar Suporte</SupportButton>
        </form>
      </div>
    </div>
  );
}
