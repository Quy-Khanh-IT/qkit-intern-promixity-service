import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/user/entities/user.entity';
import { BaseRepositoryAbstract } from '../../../cores/repository/base/repositoryAbstract.base';

export class UserRepository extends BaseRepositoryAbstract<User> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super(userModel);
  }
}
