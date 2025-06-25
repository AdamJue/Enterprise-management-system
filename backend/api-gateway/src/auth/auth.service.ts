import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MicroserviceClientService } from '../common/services/microservice-client.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponse, JwtPayload } from './types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private microserviceClient: MicroserviceClientService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.microserviceClient.callUserService(
        'auth.validate_user',
        { username, password }
      );
      
      if (user && user.isActive) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      throw new UnauthorizedException('用户名或密码错误');
    }
  }

  async login(user: any): Promise<LoginResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles?.map(role => role.name) || [],
    };

    const access_token = this.jwtService.sign(payload);

    // 更新用户的最后登录时间
    try {
      await this.microserviceClient.callUserService('auth.update_login_info', {
        userId: user.id,
      });
    } catch (error) {
      // 忽略更新登录信息的错误
    }

    return {
      access_token,
      token_type: 'Bearer',
      expires_in: this.getTokenExpirationTime(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles?.map(role => role.name) || [],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    try {
      // 检查用户是否已存在
      const existingUser = await this.microserviceClient.callUserService(
        'users.find_by_username_or_email',
        { username: registerDto.username, email: registerDto.email }
      );

      if (existingUser) {
        throw new BadRequestException('用户名或邮箱已存在');
      }

      // 创建新用户
      const newUser = await this.microserviceClient.callUserService(
        'users.create',
        registerDto
      );

      // 为新用户分配默认角色
      await this.microserviceClient.callUserService(
        'users.assign_default_role',
        { userId: newUser.id }
      );

      const { password, ...result } = newUser;
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('注册失败，请稍后重试');
    }
  }

  async refreshToken(user: any): Promise<{ access_token: string; expires_in: number }> {
    const payload: JwtPayload = {
      sub: user.sub,
      email: user.email,
      roles: user.roles || [],
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      expires_in: this.getTokenExpirationTime(),
    };
  }

  async logout(userId: string): Promise<{ message: string }> {
    // 清除用户的refreshToken
    await this.microserviceClient.callUserService('auth.clear_refresh_token', {
      userId,
    });

    return { message: '退出登录成功' };
  }

  private extractPermissions(roles: any[]): string[] {
    const permissions = new Set<string>();
    
    roles.forEach(role => {
      if (role.permissions) {
        role.permissions.forEach(permission => {
          permissions.add(`${permission.action}:${permission.resource}`);
        });
      }
    });

    return Array.from(permissions);
  }

  private getTokenExpirationTime(): number {
    const expiresIn = this.configService.get('JWT_EXPIRES_IN', '24h');
    // 简单解析时间字符串，实际项目中可能需要更复杂的解析
    if (expiresIn.endsWith('h')) {
      return parseInt(expiresIn) * 3600;
    } else if (expiresIn.endsWith('d')) {
      return parseInt(expiresIn) * 24 * 3600;
    }
    return 24 * 3600; // 默认24小时
  }
} 