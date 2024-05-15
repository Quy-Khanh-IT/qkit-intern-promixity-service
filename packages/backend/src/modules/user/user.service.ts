import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  ConfirmPassNotMatchException,
  NewPassNotMatchOldException,
} from 'src/common/exceptions/user.exception';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import { hashString, verifyHash } from 'src/common/utils';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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

  async changePassword(data: ChangePasswordDto, user: User): Promise<boolean> {
    const { confirmPassword, newPassword, oldPassword } = data;
    if (newPassword !== confirmPassword) {
      throw new ConfirmPassNotMatchException();
    }
    const isMatchingPass = await verifyHash(user.password, oldPassword);
    if (!isMatchingPass) {
      throw new NewPassNotMatchOldException();
    }

    const newHashedPass = await hashString(newPassword);
    const result = await this.updatePassword(user.id, newHashedPass);
    if (!result) {
      throw new InternalServerErrorException('Not success reset password');
    }

    return true;
  }

  async findOneByEmail(email: string): Promise<User> {
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
