import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ClsService } from "nestjs-cls";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: [
      "http://localhost:3000",
      "https://fivecoresolutions.com",
      // Adicione outras variações se necessário (ex: IP da rede ou produção sem https)
    ],
    credentials: true, // Permite envio de cookies
  });

  const config = new DocumentBuilder()
    .setTitle("Gestor de Frota API")
    .setDescription("API para o sistema de gerenciamento de frota")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("", app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Aplicação rodando na porta ${port}`);
}
bootstrap();
