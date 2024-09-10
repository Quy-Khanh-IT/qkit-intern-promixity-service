import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import { UploadFileConstraint } from 'src/common/constants';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/enums';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import { JwtRequestTokenGuard } from 'src/cores/guard/jwt-reset-password-token.guard';
import { RoleGuard } from 'src/cores/guard/role.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { NoContentResponseDto } from './dto/change-password.response.dto';
import { GetPublicProfileResponeDto } from './dto/get-public-profile.dto';
import { GetUserProfileForAdminDto } from './dto/get-user-profile-for-admin.dto';
import { RequesUpdateEmail } from './dto/request-update-email.dto';
import { UpdateGeneralInfoDto } from './dto/update-general-info.dto';
import { UpdateGeneralInfoResponseDto } from './dto/update-general-info.response.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { FindAllUserBusinessQuery } from './dto/find-all-user-business.query.dto';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get public profile for everyone' })
  @HttpCode(200)
  async findUserById(
    @Param('userId') userId: string,
  ): Promise<GetPublicProfileResponeDto> {
    return await this.userService.getPublicProfile(userId);
  }

  @Get(':userId/profile')
  @ApiBearerAuth()
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  async getProfileUser(
    @Param('userId') id: string,
    @Req() req: Request,
    @Query() data: GetUserProfileForAdminDto,
  ): Promise<User> {
    const result = await this.userService.getDetailProfile(
      id,
      data.userStatus,
      req.user,
    );

    return plainToClass(User, result);
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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

  @UseGuards(JwtAccessTokenGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Patch(':userId/avatar')
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', UploadFileConstraint.MULTER_OPTION))
  async updateImage(
    @UploadedFile() image: Express.Multer.File,
    @Req() req: Request,
    @Param('userId') id: string,
  ): Promise<NoContentResponseDto> {
    return {
      isSuccess: await this.userService.updateImage(req.user, id, image),
    };
  }

  @UseGuards(JwtAccessTokenGuard)
  @Post(':userId/email/forgot-email')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiBody({
    type: RequesUpdateEmail,
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully request update email.',
  })
  async requestUpdateEmail(
    @Body() data: RequesUpdateEmail,
    @Req() req: Request,
    @Param('userId') id: string,
  ): Promise<NoContentResponseDto> {
    return {
      isSuccess: await this.userService.requestResetEmail(data, req.user, id),
    };
  }

  @UseGuards(JwtRequestTokenGuard)
  @Patch(':userId/email/reset-email')
  @HttpCode(200)
  @ApiHeader({
    name: 'request-token-header',
    description: 'The reset email token',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully reset email.',
  })
  async resetEmail(
    @Req() req: Request,
    @Param('userId') id: string,
  ): Promise<NoContentResponseDto> {
    const JWTtoken: string = req.headers['request-token-header'].toString();
    return {
      isSuccess: await this.userService.resetEmail(JWTtoken, req.user, id),
    };
  }
}
