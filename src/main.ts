import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Swagger
  const config = new DocumentBuilder()
    .setTitle('Reading Recommendation System APIs')
    .setDescription('API documentation for the Reading Recommendation System APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('recommendation-system/docs', app, document);

  await app.listen(3000);
}
bootstrap();
