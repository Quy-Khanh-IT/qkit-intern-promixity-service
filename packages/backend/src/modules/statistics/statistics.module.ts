import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessSchema } from '../business/entities/business.entity';
import { CategoryModule } from '../category/category.module';
import { CategorySchema } from '../category/entities/category.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { BusinessRepository } from './repository/business.repository';
import { CategoryRepository } from './repository/category.repository';
import { UserRepository } from './repository/user.repository';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [
    CategoryModule,
    JwtModule.register({}),
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      {
        name: 'Business',
        schema: BusinessSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [
    StatisticsService,
    CategoryRepository,
    UserRepository,
    BusinessRepository,
  ],
})
export class StatisticsModule {}
