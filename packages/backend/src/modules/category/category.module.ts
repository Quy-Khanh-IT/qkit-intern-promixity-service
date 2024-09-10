import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategorySchema } from './entities/category.entity';
import { CategoryRepository } from './repository/category.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
