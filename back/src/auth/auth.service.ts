import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<Record<string, unknown> | null> {
    const user = await this.usersService.findOne(username);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * TODO (Architectural): SSO/OAuth Integration
   * Future implementation should integrate with Google SSO or LDAP via Strategy Pattern.
   * This method will need to handle OAuth tokens or SAML assertions instead of just basic auth.
   */
  async login(user: { username: string; password?: string }) {
    if (!user.password) {
        throw new UnauthorizedException();
    }
    const validatedUser = await this.validateUser(user.username, user.password);
    if (!validatedUser) {
        throw new UnauthorizedException();
    }
    const payload = { username: validatedUser.user, sub: validatedUser.id, role: validatedUser.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: validatedUser.id,
        user: validatedUser.user,
        role: validatedUser.role
      }
    };
  }
}
