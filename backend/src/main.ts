import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Configuração global de pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )

  // Configuração de CORS
  app.enableCors()

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle("Gestor de Frota API")
    .setDescription("API para o sistema de gerenciamento de frota")
    .setVersion("1.0")
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api", app, document)

  // Iniciar servidor
  const port = process.env.PORT || 3001
  await app.listen(port)
  console.log(`Aplicação rodando na porta ${port}`)
}
bootstrap()
