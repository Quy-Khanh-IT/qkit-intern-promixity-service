import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePasswordResponseDto } from './dto/change-password.response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const result: User = await this.userService.create(createUserDto);
    return result;
  }

  @UseGuards(JwtAccessTokenGuard)
  @Patch('password')
  @HttpCode(201)
  @ApiBody({
    type: ChangePasswordDto,
  })
  @ApiResponse({
    status: 200,
    type: ChangePasswordResponseDto,
    description: 'User successfully reset password.',
  })
  @ApiBearerAuth()
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
