import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_DOCKER_API_URL;

export async function fetchServerSide<T>(url: string): Promise<T> {
  try {
    const access_token = cookies().get("access_token")?.value;

    if (!access_token) {
      return redirect("/login");
    }
    const res = await fetch(NEXT_PUBLIC_BASE_URL + url, {
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
