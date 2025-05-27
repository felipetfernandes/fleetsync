// app/error.tsx
"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-gray-200 p-4">
      <h1 className="text-6xl font-bold mb-4">Erro</h1>
      <p className="text-lg mb-8">Algo deu errado. Tente novamente.</p>
      <button
        onClick={() => reset()}
        className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 transition"
      >
        Recarregar
      </button>
    </main>
  );
}
