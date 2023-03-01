import {
  Controller,
  Inject,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { User } from './users.entity';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private authSevice: AuthService,
  ) {}

  @Post('/signup')
  signUp(
    @Body() authCredentialDto: AuthCredentialDto,
    @Res() res: Response,
  ): Promise<User | Response> {
    return this.authSevice.signUp(authCredentialDto, res);
  }

  @Post('/signin')
  signIn(@Body() authCredentialDto: AuthCredentialDto): Promise<string> {
    return this.authSevice.signIn(authCredentialDto);
  }
}
