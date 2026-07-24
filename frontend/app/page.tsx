import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { fetchServerSide } from "@/lib/utils/fetchServerSide"
import { User } from "@/types/types"

export default async function Home() {
  const token = cookies().get("access_token")?.value

  if (!token) {
    return redirect("/login")
  }

  try {
    console.log("Verificando autenticação via /auth/me...")
    const user: User = await fetchServerSide("GET", "/auth/me")

    console.log("Usuário autenticado:", user)

    if (!user || !user.role) {
      console.log("Redirecionando para login - usuário inválido")
      return redirect("/login")
    }

    // Direcionamento por papel (multi-role)
    const roleRedirectMap: Record<string, string> = {
      ADMIN: "/dashboard",
      BRANCH_MANAGER: `/branchs/${user.branchId}`,
      WORKSHOP_MANAGER: `/workshops/`,
      DRIVER: `/fleet/`,
    }

    const redirectTo = roleRedirectMap[user.role] || "/login"

    if (redirectTo === "/login") {

    }

    return redirect(redirectTo)
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      
      throw error // Re-lança o erro de redirecionamento para que o Next.js possa processá-lo
    }

    return redirect("/login")
  }
}
