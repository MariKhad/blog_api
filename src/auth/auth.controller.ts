import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../decorators/public.decorator';

@ApiTags('Autorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  login(@Body() authDto: CreateAuthDto) {
    return this.authService.login(authDto);
  }

  @Public()
  @Post('/registration')
  @UseInterceptors(FileInterceptor('image'))
  registration(@Body() userDto: CreateUserDto, @UploadedFile() image: any) {
    return this.authService.registration(userDto, image);
  }
}
