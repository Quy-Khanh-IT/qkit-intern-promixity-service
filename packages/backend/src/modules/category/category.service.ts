import { Injectable } from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryRepository.create(createCategoryDto);
  }

  async findAll() {
    return await this.categoryRepository.findAll({});
  }

  async findOneById(id: string) {
    return await this.categoryRepository.findOneById(id);
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} category`;
  // }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
}
