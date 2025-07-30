import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import verifyJwt from "@/lib/utils/jwt";

export default function Home() {
  const token = cookies().get("access_token")?.value;

  if (!token) {
    return redirect("/login");
  }

  const payload = verifyJwt(token); // decodifica JWT e valida expiração, etc.

  console.log(payload);

  if (!payload) {
    return redirect("/login"); // token inválido
  }

  // Direcionamento por papel (multi-role)
  const roleRedirectMap: Record<string, string> = {
    ADMIN: "/dashboard",
    BRANCH_MANAGER: `/branchs/${payload.branchId}`,
    WORKSHOP_MANAGER: `/workshops/`,
    DRIVER: `/fleet/}`,
  };

  const redirectTo = roleRedirectMap[payload.role] || "/login";

  console.log("Redirecting to:", redirectTo);

  return redirect(redirectTo);
}
