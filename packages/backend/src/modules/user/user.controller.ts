import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result: User = await this.userService.create(createUserDto);
    return result;
  }

  @Patch()
  async update() {
    const result: User = await this.userService.update();
    console.log(result);
    return result;
  }

  @Delete()
  async delete() {
    return await this.userService.delete();
  }
}
