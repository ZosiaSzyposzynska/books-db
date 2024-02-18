import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDTO } from './register.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
  private userService: UserService,
  private jwtService: JwtService,
  private configService: ConfigService,
) {}

  public async register(authData: RegisterDTO) {
    const hashedPassword = await bcrypt.hash(authData.password, 10);
    const userData = {
      email: authData.email,
    };
    return this.userService.create(userData, hashedPassword);
  }

  public async validateUser(email: string, password: string) {
    const user = await this.userService.getByEmail(email);
    if (
      user &&
      (await bcrypt.compare(password, user.password.hashedPassword))
    ) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  public async createSession(user: any) {
    const payload = { email: user.email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
  secret: this.configService.get('jwt.secret'),
  expiresIn: this.configService.get('jwt.expiresIn'),
});

    return {
      access_token: accessToken,
    };
  }
}
