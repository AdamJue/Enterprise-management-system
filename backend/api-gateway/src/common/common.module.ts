import { Module, Global } from '@nestjs/common';
import { LoggerService } from './services/logger.service';
import { MicroserviceClientService } from './services/microservice-client.service';

@Global()
@Module({
  providers: [LoggerService, MicroserviceClientService],
  exports: [LoggerService, MicroserviceClientService],
})
export class CommonModule {} 