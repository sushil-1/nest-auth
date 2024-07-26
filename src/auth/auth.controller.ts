import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
  } from '@nestjs/common';
  import { AuthGuard } from './auth.guard';
  import { AuthService } from './auth.service';
  
  @Controller('auth')
  export class AuthController {
    constructor(
      private authService: AuthService    ) {}
  
    @Post('register')
    async register(@Body() signUpDto: { username: string; password: string }) {
      return this.authService.register(signUpDto.username, signUpDto.password);
    }
  
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: { username: string; password: string }) {
      return this.authService.signIn(signInDto.username, signInDto.password);
    }
  
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
      return req.user;
    }
  
    @Post('forgot-password')
    async forgotPassword(@Body() body: { username: string }) {
      const { username } = body;
      const result = await this.authService.requestPasswordReset(username);
      return { result };
    }
  
    @Post('reset-password')
    async resetPassword(@Body() body: { resetToken: string; newPassword: string }) {
      const { resetToken, newPassword } = body;
      const result = await this.authService.resetPassword(resetToken, newPassword);
      return { message: result ? 'Password reset successful.' : 'Invalid or expired token.' };
    }
  }
  