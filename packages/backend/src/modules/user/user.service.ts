import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InvalidTokenException } from 'src/common/exceptions';
import {
  ConfirmPassNotMatchException,
  NewPassNotMatchOldException,
} from 'src/common/exceptions/user.exception';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import { hashString, verifyHash } from 'src/common/utils';
import { UploadFileService } from '../upload-file/upload-file.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateGeneralInfoDto } from './dto/update-general-info.dto';
import { UpdateGeneralInfoResponseDto } from './dto/update-general-info.response.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly uploadFileService: UploadFileService,
  ) {}

  async findAll(): Promise<FindAllResponse<User>> {
    return await this.userRepository.findAll({});
  }

  async softDeleteById(id: string): Promise<boolean> {
    return await this.userRepository.softDelete(id);
  }

  async hardDeleteById(id: string): Promise<boolean> {
    return await this.userRepository.hardDelete(id);
  }

  async checkEmailExist(email: string): Promise<boolean> {
    const result = await this.userRepository.findOneByCondition({
      email: email,
    });
    return result ? true : false;
  }

  async updatePassword(id: string, password: string): Promise<User> {
    const user = await this.userRepository.update(id, { password });
    return user;
  }

  verifyUserFromToken(userRequestId: string, userTokenId: string): boolean {
    return userRequestId === userTokenId;
  }

  async changePassword(
    data: ChangePasswordDto,
    userFromToken: User,
    userIdRequest: string,
  ): Promise<boolean> {
    if (!this.verifyUserFromToken(userIdRequest, userFromToken.id)) {
      throw new InternalServerErrorException('Not allow to change password');
    }
    const { confirmPassword, newPassword, oldPassword } = data;
    if (newPassword !== confirmPassword) {
      throw new ConfirmPassNotMatchException();
    }
    const isMatchingPass = await verifyHash(
      userFromToken.password,
      oldPassword,
    );
    if (!isMatchingPass) {
      throw new NewPassNotMatchOldException();
    }

    const newHashedPass = await hashString(newPassword);
    const result = await this.updatePassword(userFromToken.id, newHashedPass);
    if (!result) {
      throw new InternalServerErrorException('Not success reset password');
    }

    return true;
  }

  async updateGeneralInfo(
    updateGeneralInfo: UpdateGeneralInfoDto,
    userFromToken: User,
    userIdRequest: string,
  ): Promise<UpdateGeneralInfoResponseDto> {
    if (!this.verifyUserFromToken(userIdRequest, userFromToken.id)) {
      throw new InvalidTokenException();
    }
    const address = this.createAddressObjectForUpdate(updateGeneralInfo);
    // Not yet validate address because API of it is also lack of
    const result = await this.userRepository.update(userIdRequest, {
      ...updateGeneralInfo,
      address: {
        ...address,
      },
    });

    if (!result) {
      throw new InternalServerErrorException('Update general info failed');
    }

    return {
      id: result.id,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      image: result.image,
      phoneNumber: result.phoneNumber,
      address: result.address,
    };
  }

  /*
  Not yet handling deleting the old image of user
  */
  async updateImage(
    userFromToken: User,
    userRequestId: string,
    imageFile: Express.Multer.File,
  ): Promise<boolean> {
    if (!this.verifyUserFromToken(userRequestId, userFromToken.id)) {
      throw new InvalidTokenException();
    }
    const path = (
      await this.uploadFileService.uploadImageToCloudinary(imageFile)
    ).secure_url;

    if (!path) {
      throw new InternalServerErrorException();
    }

    const result = await this.userRepository.update(userFromToken.id, {
      image: path,
    });

    if (!result) {
      throw new InternalServerErrorException();
    }
    return true;
  }

  createAddressObjectForUpdate(data: UpdateGeneralInfoDto): {
    city: string;
    province: string;
    country: string;
  } {
    if (!data.city || !data.province || !data.country) {
      throw new BadRequestException(
        'Address must have all 3 fields(city, province, country) or leave it all blank',
      );
    }
    return {
      city: data.city,
      province: data.province,
      country: data.country,
    };
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneByCondition({ email });
  }

  async findOneById(id: string): Promise<User> {
    return await this.userRepository.findOneById(id);
  }

  async delete() {
    return this.userRepository.hardDelete('655ab2ba456d22a01c27972c');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(createUserDto);
    return user;
  }
}
