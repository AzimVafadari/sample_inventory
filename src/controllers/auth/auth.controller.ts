import { Controller, Post, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(
    @Query('username') username: string,
    @Query('password') password: string,
  ) {
    return this.authService.signIn(username, password);
  }
}
