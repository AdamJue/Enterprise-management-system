import { Controller, Post, Body } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Post('register')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  // 微服务消息处理
  @MessagePattern('auth.login')
  async handleLogin(@Payload() payload: { username: string; password: string }) {
    return this.authService.login(payload.username, payload.password);
  }

  @MessagePattern('auth.register')
  async handleRegister(@Payload() userData: any) {
    return this.authService.register(userData);
  }

  @MessagePattern('auth.validate_user')
  async validateUser(@Payload() payload: { username: string; password: string }) {
    // 支持使用用户名或邮箱登录
    const user = await this.authService.validateUser(payload.username, payload.password);
    return user;
  }
} 