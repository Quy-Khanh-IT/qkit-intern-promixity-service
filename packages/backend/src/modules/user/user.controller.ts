import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { NoContentResponseDto } from './dto/change-password.response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateGeneralInfoDto } from './dto/update-general-info.dto';
import { UpdateGeneralInfoResponseDto } from './dto/update-general-info.response.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const result: User = await this.userService.create(createUserDto);
    return result;
  }

  @UseGuards(JwtAccessTokenGuard)
  @Patch(':userId/password')
  @HttpCode(201)
  @ApiBody({
    type: ChangePasswordDto,
  })
  @ApiResponse({
    status: 200,
    type: NoContentResponseDto,
    description: 'User successfully reset password.',
  })
  async resetPassword(
    @Body() data: ChangePasswordDto,
    @Req() req: Request,
    @Param('userId') id: string,
  ): Promise<NoContentResponseDto> {
    const result = await this.userService.changePassword(data, req.user, id);
    return {
      isSuccess: result,
    };
  }

  @UseGuards(JwtAccessTokenGuard)
  @Patch(':userId/profile')
  @HttpCode(201)
  @ApiBody({
    type: UpdateGeneralInfoDto,
  })
  @ApiResponse({
    type: User,
  })
  async updateGeneralInfo(
    @Body() data: UpdateGeneralInfoDto,
    @Req() req: Request,
    @Param('userId') id: string,
  ): Promise<UpdateGeneralInfoResponseDto> {
    return await this.userService.updateGeneralInfo(data, req.user, id);
  }
}
