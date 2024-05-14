import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  HttpCode,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtResetPasswordTokenGuard } from 'src/cores/guard/jwt-reset-password-token.guard';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ResetPasswordDto } from '../auth/dto';
import { Request } from 'express';
import { ChangePasswordResponseDto } from './dto/change-password.response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(@Body() createUserDto: CreateUserDto) {
    const result: User = await this.userService.create(createUserDto);
    return result;
  }

  @Patch('password')
  @HttpCode(201)
  @ApiBody({
    type: ResetPasswordDto,
  })
  @ApiResponse({
    status: 200,
    type: ChangePasswordResponseDto,
    description: 'User successfully reset password.',
  })
  @UseGuards(JwtResetPasswordTokenGuard)
  async resetPassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ): Promise<ChangePasswordResponseDto> {
    const result = await this.userService.changePassword(
      changePasswordDto,
      req.user,
    );
    return {
      isSuccess: result,
    };
  }
}
