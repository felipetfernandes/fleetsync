'use client';

type LogButtonProps = {
  message: string;
};

export default function LogButton({ message }: LogButtonProps) {
  return (
    <button
      onClick={() => console.log(message)}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Clique para logar
    </button>
  );
}