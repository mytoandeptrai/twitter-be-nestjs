import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Apis Auth')
export class AuthController {
  constructor(private authService: AuthService) {}
}
