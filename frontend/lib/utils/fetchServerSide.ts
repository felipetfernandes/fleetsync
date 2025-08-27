import { cookies } from "next/headers"

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_DOCKER_API_URL

export async function fetchServerSide<T>(method: string, url: string, body?: any): Promise<T> {
  try {
    const access_token = cookies().get("access_token")?.value

    if (!access_token) {
      
      throw new Error("Token de acesso não encontrado")
    }

    const requestOptions: RequestInit = {
      method,
      credentials: "include",
      next: { revalidate: 120 },
      headers: {
        "Content-Type": "application/json",
        cookie: `access_token=${access_token}`,
      },
    }

    if (body && method !== "GET") {
      requestOptions.body = JSON.stringify(body)
      
    }

    const res = await fetch(NEXT_PUBLIC_BASE_URL + url, requestOptions)

    if (!res.ok) {
      const errorText = await res.text()
      
      throw new Error(`Erro ao buscar ${url}: ${res.status} ${res.statusText} - ${errorText}`)
    }

    const data = await res.json()
    return data as T
  } catch (error) {
    throw error
  }
}
