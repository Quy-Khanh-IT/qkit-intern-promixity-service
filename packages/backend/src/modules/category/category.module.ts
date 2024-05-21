import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './repository/category.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './entities/category.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
