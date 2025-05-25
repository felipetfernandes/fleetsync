import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDateTime = (date: Date | string) => {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return format(parsedDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
};

export  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "não informado";
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return format(parsedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};
  
export  const formatShortDate = (date: Date | string | undefined) => {
    if (!date) return "não informado";
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return format(parsedDate, "dd/MM/yyyy", { locale: ptBR });
  };

export const formatCurrency = (value: number | undefined) => {
    if (!value) return "não informado";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };
