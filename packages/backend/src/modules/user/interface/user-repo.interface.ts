import { BaseRepositoryInterface } from 'src/cores/repository/base/repositoryInterface.base';
import { User } from '../entities/user.entity';

interface UserRepositoryInterface extends BaseRepositoryInterface<User> {
  findAllUserWithAddress(): Promise<User[]>;
}
