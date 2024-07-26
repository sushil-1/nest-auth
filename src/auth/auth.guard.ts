import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { jwtConstants } from './constants';
  import { Request } from 'express';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      
     // console.log('Extracted Token:', token);
  
      if (!token) {
       // console.log('No token found');
        throw new UnauthorizedException();
      }
  
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });
        
        request['user'] = payload;
      } catch (error) {
        console.error('JWT Verification Error:', error); 
        throw new UnauthorizedException();
      }
  
      return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
      //  console.log('Authorization Header:', request.headers.authorization);
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }
      
  }
  