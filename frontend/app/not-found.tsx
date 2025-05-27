// app/not-found.tsx
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-gray-200 p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Página não encontrada</p>
      <a
        href="/"
        className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
      >
        Voltar para o início
      </a>
    </main>
  );
}
