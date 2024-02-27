import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../decorators/public.decorator';

@ApiTags('Autorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Registered users can get token after login' })
  @ApiResponse({
    status: 200,
    description: 'Registered users can get token after login',
  })
  @Public()
  @Post('/login')
  login(@Body() authDto: CreateAuthDto) {
    return this.authService.login(authDto);
  }

  @ApiOperation({ summary: 'Registration for a new user' })
  @Public()
  @Post('/registration')
  @UseInterceptors(FileInterceptor('image'))
  registration(@Body() userDto: CreateUserDto, @UploadedFile() image: any) {
    return this.authService.registration(userDto, image);
  }
}
