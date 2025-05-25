import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fetchClientSide<T>(url: string): Promise<T> {
  try {
    const access_token = cookies().get("access_token")?.value;

    if (!access_token) {
      return redirect("/login");
    }
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
      next: { revalidate: 120 },
      headers: {
        "Content-Type": "application/json",
        cookie: `access_token=${access_token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Erro ao buscar ${url}: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data as T;
  } catch (error) {
    console.error(`Erro ao buscar dados de ${url}:`, error);
    throw error;
  }
}
