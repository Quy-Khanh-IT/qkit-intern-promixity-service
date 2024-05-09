import {
  Injectable,
  InternalServerErrorException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import { Business } from '../business/entities/business.entity';
import { BusinessService } from '../business/business.service';

@Injectable()
export class UserService {
  constructor(
    // @Inject(forwardRef(() => BusinessService))
    private readonly BusinessService: BusinessService,
    private readonly userRepository: UserRepository,
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
    if (!user) {
      throw new InternalServerErrorException('Update password failed');
    }
    return user;
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

  async addBusiness(userId: string, businessId: string): Promise<User> {
    console.log('businessId', businessId);

    const update = {
      $addToSet: { businesses: businessId },
    } as Partial<User>;

    const user = await this.userRepository.update(userId, update);

    console.log('user', user);

    if (!user) {
      throw new InternalServerErrorException('Update business failed');
    }
    return user;
  }

  async removeBusiness(userId: string, businessId: string): Promise<User> {
    const update = {
      $pull: { businesses: businessId },
    } as Partial<User>;

    const user = await this.userRepository.update(userId, update);
    if (!user) {
      throw new InternalServerErrorException('Remove business failed');
    }
    return user;
  }

  async getAllBusiness(user: User): Promise<FindAllResponse<Business> | []> {
    const businesses = await this.BusinessService.getAllByCurrentUser(user);

    return businesses;
  }
}
