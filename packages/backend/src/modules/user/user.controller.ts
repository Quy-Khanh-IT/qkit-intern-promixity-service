import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { Request } from 'express';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  async create(@Body() createUserDto: CreateUserDto) {
    const result: User = await this.userService.create(createUserDto);
    return result;
  }

  @Get('/businesses')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'User successfully get business.',
  })
  async getAllBusiness(@Req() req: Request) {
    const result = await this.userService.getAllByUser(req.user);
    return result;
  }
}
