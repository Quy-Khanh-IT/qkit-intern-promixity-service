import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Post()
  async create() {
    const result: User = await this.userService.create();
    console.log(result);
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
