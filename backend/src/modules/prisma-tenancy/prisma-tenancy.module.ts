import { Module, Global } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { PrismaTenancyProvider } from './prisma-tenancy.provider';
import { TENANT_PRISMA_CLIENT } from './prisma-tenancy.constants';
import { PrismaModule } from '../prisma/prisma.module';


@Global() // Torna os providers exportados disponíveis globalmente
@Module({
  imports: [
    PrismaModule, // Importa para que PrismaService esteja disponível para injeção
    ClsModule,    // Importa para que ClsService esteja disponível para injeção
  ],
  providers: [
    PrismaTenancyProvider, // Declara nosso provedor customizado
  ],
  exports: [
    TENANT_PRISMA_CLIENT, // Exporta o token para que possa ser usado para injeção em outros módulos
  ],
})
export class PrismaTenancyModule {}

