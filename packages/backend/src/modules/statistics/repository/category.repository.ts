import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from 'src/cores/repository/base/repositoryAbstract.base';
import { Category } from 'src/modules/category/entities/category.entity';

export class CategoryRepository extends BaseRepositoryAbstract<Category> {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {
    super(categoryModel);
  }
}
