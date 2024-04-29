import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<FindAllResponse<User>> {
    return await this.userRepository.findAll({});
  }

  async checkEmailExist(email: string): Promise<boolean> {
    const result = await this.userRepository.findOneByCondition({
      email: email,
    });
    return result ? true : false;
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneByCondition({ email });
  }

  async delete() {
    return this.userRepository.delete('655ab2ba456d22a01c27972c');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(createUserDto);
    return user;
  }
}
