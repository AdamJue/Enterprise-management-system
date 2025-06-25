import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(usernameOrEmail: string, password: string): Promise<any> {
    try {
      // 判断输入是邮箱还是用户名
      const isEmail = usernameOrEmail.includes('@');
      const user = isEmail 
        ? await this.usersService.findByEmail(usernameOrEmail)
        : await this.usersService.findByUsername(usernameOrEmail);
        
      if (user && user.isActive && await user.validatePassword(password)) {
        const { password, refreshToken, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      console.error('Validate user error:', error);
      return null;
    }
  }

  async login(usernameOrEmail: string, password: string) {
    const user = await this.validateUser(usernameOrEmail, password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(userData: any) {
    return this.usersService.create(userData);
  }
} 