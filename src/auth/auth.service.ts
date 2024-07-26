import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // For hashing passwords
import { v4 as uuidv4 } from 'uuid'; // For generating unique reset tokens

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(username: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(username: string, password: string): Promise<{ access_token: string }> {
    const existingUser = await this.usersService.findOne(username);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersService.register(username, hashedPassword);

    const payload = { username: newUser.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async requestPasswordReset(username: string): Promise<string | boolean> {
    const user = await this.usersService.findOne(username);
    if (!user) return false;

    const resetToken = uuidv4();
    await this.usersService.storeResetToken(username, resetToken);
    // Here you would normally send the reset token to the user's email
    return resetToken;
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<boolean> {
    const username = await this.usersService.verifyResetToken(resetToken);
    if (!username) return false;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(username, hashedPassword);
    return true;
  }
}
