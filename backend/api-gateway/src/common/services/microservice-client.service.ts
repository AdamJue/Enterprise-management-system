import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable()
export class MicroserviceClientService implements OnModuleInit {
  private userServiceClient: ClientProxy;
  private orderServiceClient: ClientProxy;
  private adminServiceClient: ClientProxy;

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {}

  async onModuleInit() {
    // 异步初始化客户端，不阻塞应用启动
    this.initializeClients().catch(error => {
      this.logger.warn('Failed to connect to microservices, will retry later', 'MicroserviceClientService');
    });
  }

  private async initializeClients() {
    try {
      // 用户服务客户端
      this.userServiceClient = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [this.configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
          queue: 'user_service_queue',
          queueOptions: {
            durable: true,
          },
        },
      });

      // 订单服务客户端
      this.orderServiceClient = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [this.configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
          queue: 'order_service_queue',
          queueOptions: {
            durable: true,
          },
        },
      });

      // 管理服务客户端
      this.adminServiceClient = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [this.configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
          queue: 'admin_service_queue',
          queueOptions: {
            durable: true,
          },
        },
      });

      // 尝试连接到微服务，但不强制要求成功
      try {
        await Promise.all([
          this.userServiceClient.connect(),
          this.orderServiceClient.connect(),
          this.adminServiceClient.connect(),
        ]);
        this.logger.log('All microservice clients connected successfully', 'MicroserviceClientService');
      } catch (connectError) {
        this.logger.warn('Some microservice connections failed, but continuing...', 'MicroserviceClientService');
      }
    } catch (error) {
      this.logger.error('Failed to initialize microservice clients', error.stack, 'MicroserviceClientService');
      // 不抛出错误，允许应用继续启动
    }
  }

  // 用户服务调用
  async callUserService<T = any>(pattern: string, data: any): Promise<T> {
    try {
      const result = await firstValueFrom(
        this.userServiceClient.send(pattern, data).pipe(timeout(10000))
      );
      return result;
    } catch (error) {
      this.logger.error(`User service call failed: ${pattern}`, error.stack, 'MicroserviceClientService');
      throw error;
    }
  }

  // 订单服务调用
  async callOrderService<T = any>(pattern: string, data: any): Promise<T> {
    try {
      const result = await firstValueFrom(
        this.orderServiceClient.send(pattern, data).pipe(timeout(10000))
      );
      return result;
    } catch (error) {
      this.logger.error(`Order service call failed: ${pattern}`, error.stack, 'MicroserviceClientService');
      throw error;
    }
  }

  // 管理服务调用
  async callAdminService<T = any>(pattern: string, data: any): Promise<T> {
    try {
      const result = await firstValueFrom(
        this.adminServiceClient.send(pattern, data).pipe(timeout(10000))
      );
      return result;
    } catch (error) {
      this.logger.error(`Admin service call failed: ${pattern}`, error.stack, 'MicroserviceClientService');
      throw error;
    }
  }

  // 发送事件到用户服务
  emitUserServiceEvent(pattern: string, data: any): void {
    this.userServiceClient.emit(pattern, data);
  }

  // 发送事件到订单服务
  emitOrderServiceEvent(pattern: string, data: any): void {
    this.orderServiceClient.emit(pattern, data);
  }

  // 发送事件到管理服务
  emitAdminServiceEvent(pattern: string, data: any): void {
    this.adminServiceClient.emit(pattern, data);
  }

  // 健康检查
  async healthCheck(): Promise<{ [key: string]: boolean }> {
    const results = {
      userService: false,
      orderService: false,
      adminService: false,
    };

    try {
      await this.callUserService('health.check', {});
      results.userService = true;
    } catch (error) {
      this.logger.warn('User service health check failed', 'MicroserviceClientService');
    }

    try {
      await this.callOrderService('health.check', {});
      results.orderService = true;
    } catch (error) {
      this.logger.warn('Order service health check failed', 'MicroserviceClientService');
    }

    try {
      await this.callAdminService('health.check', {});
      results.adminService = true;
    } catch (error) {
      this.logger.warn('Admin service health check failed', 'MicroserviceClientService');
    }

    return results;
  }

  async onModuleDestroy() {
    await Promise.all([
      this.userServiceClient?.close(),
      this.orderServiceClient?.close(),
      this.adminServiceClient?.close(),
    ]);
  }
} 