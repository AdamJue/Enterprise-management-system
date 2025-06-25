import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 配置微服务
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
      queue: 'order_service_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  // 全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 启动微服务
  await app.startAllMicroservices();

  // 启动HTTP服务器（用于健康检查等）
  const port = configService.get('PORT', 3003);
  await app.listen(port);

  console.log(`🚀 Order Service is running on: http://localhost:${port}`);
  console.log(`📡 Order Service microservice is listening on RabbitMQ`);
}

bootstrap().catch((error) => {
  console.error('Failed to start Order Service:', error);
  process.exit(1);
}); 