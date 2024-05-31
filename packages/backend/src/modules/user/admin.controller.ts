import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/enums';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import { RoleGuard } from 'src/cores/guard/role.guard';
import { NoContentResponseDto } from './dto/change-password.response.dto';
import { DeleteUserQueryDto } from './dto/delete-user.query.dto';
import { FindAllUserQuery } from './dto/find-all-user.query.dto';
import { RestoreResponseDto } from './dto/restore.response.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UserService } from './user.service';

@Controller('admin')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@ApiTags('Admin')
@UseGuards(JwtAccessTokenGuard, RoleGuard)
export class AdminController {
  constructor(private readonly userService: UserService) {}

  @Delete('users/:id')
  @HttpCode(200)
  async deleteUser(
    @Query() data: DeleteUserQueryDto,
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<NoContentResponseDto> {
    return {
      isSuccess: await this.userService.delete(data, req.user.id, id),
    };
  }

  @Patch('users/:id/role')
  @HttpCode(200)
  async grantRole(
    @Req() req: Request,
    @Body() data: UpdateRoleDto,
    @Param('id') id: string,
  ): Promise<NoContentResponseDto> {
    return {
      isSuccess: await this.userService.updateRole(data.role, id, req.user.id),
    };
  }

  @Get('roles')
  @HttpCode(200)
  async getAllRoles(): Promise<UserRole[]> {
    return this.userService.getAllRoles();
  }

  @Get('users')
  @HttpCode(200)
  async findAllUser(@Query() data: FindAllUserQuery) {
    const transferedData = plainToClass(FindAllUserQuery, data);
    return await this.userService.getAllUser(transferedData);
  }

  @Patch('users/:id/restore')
  @HttpCode(200)
  async restore(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<RestoreResponseDto> {
    return await this.userService.restore(id, req.user.id);
  }
}
