// Define um token único para injetar o Prisma Client estendido.
// Usar um Symbol garante que não haverá conflitos de nome.
export const TENANT_PRISMA_CLIENT = Symbol("TENANT_PRISMA_CLIENT");
