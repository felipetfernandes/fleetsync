const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_LOCAL_API_URL

export async function fetchClientSide<T>(method: string, url: string, payload?: any): Promise<T> {
  try {
    const res = await fetch(NEXT_PUBLIC_BASE_URL + url, {
      method,
      credentials: "include", // Isso inclui cookies do navegador automaticamente
      headers: {
        "Content-Type": "application/json",
      },
      body: payload ? JSON.stringify(payload) : undefined,
    })

    if (res.status === 401 || res.status === 403) {
      // Redireciona para login no client-side
      window.location.href = "/login"
      return Promise.reject(new Error("Não autorizado"))
    }

    if (!res.ok) {
      let errorMessage = `Erro ao buscar ${url}: ${res.status} ${res.statusText}`

      try {
        const errorData = await res.json()
        if (errorData.message) {
          errorMessage = errorData.message
        }
      } catch (e) {
        // Se não conseguir parsear o JSON, usar a mensagem padrão
      }

      throw new Error(errorMessage)
    }

    const contentType = res.headers.get("content-type")
    if (res.status === 204 || !contentType?.includes("application/json")) {
      return {} as T
    }

    const data = await res.json()
    return data as T
  } catch (error) {
    console.error(`Erro ao buscar dados de ${url}:`, error)
    throw error
  }
}
