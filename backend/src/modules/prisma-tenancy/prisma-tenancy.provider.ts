import { Provider } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { TENANT_PRISMA_CLIENT } from './prisma-tenancy.constants';
import { createTenantExtension } from './prisma-tenancy.extension';
import { PrismaService } from '../prisma/prisma.service';

// Define o tipo para o cliente Prisma estendido
// Isso ajuda com o type checking e autocompletar nos serviços
export type ExtendedTenantClient = ReturnType<typeof createTenantExtensionClient>;

// Função auxiliar para criar o cliente estendido (melhora a tipagem)
function createTenantExtensionClient(prisma: PrismaService, cls: ClsService) {
  const extension = createTenantExtension(cls);
  return prisma.$extends(extension);
}

// Define o Provedor Customizado (Factory Provider)
export const PrismaTenancyProvider: Provider = {
  provide: TENANT_PRISMA_CLIENT, // O token que será usado para injeção
  inject: [PrismaService, ClsService], // Dependências que o factory precisa
  useFactory: (prisma: PrismaService, cls: ClsService): ExtendedTenantClient => {
    // A função factory que cria e retorna a instância estendida
    return createTenantExtensionClient(prisma, cls);
  },
};

