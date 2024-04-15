import { Model, FilterQuery, QueryOptions } from 'mongoose';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import { BaseRepositoryInterface } from './repostioryInterface.base';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
  implements BaseRepositoryInterface<T>
{
  protected constructor(private readonly model: Model<T>) {
    this.model = model;
  }

  async create(dto: T | any): Promise<T> {
    const created_data = await this.model.create(dto);
    return created_data.toObject() as T;
  }

  async findOneById(id: string): Promise<T> {
    const item = (await this.model.findById(id).lean().exec()) as T;
    return item;
  }

  async findOneByCondition(condition = {}): Promise<T> {
    return (await this.model
      .findOne({
        ...condition,
      })
      .lean()
      .exec()) as T;
  }

  async findAll(
    condition: FilterQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<FindAllResponse<T>> {
    const items = (await this.model
      .find({ ...condition }, options?.projection, options)
      .lean()
      .exec()) as T[];

    return {
      count: items.length,
      items,
    };
  }

  async update(id: string, dto: Partial<T>): Promise<T> {
    const result = await this.model.findOneAndUpdate(
      { _id: id } as FilterQuery<T>,
      dto,
      {
        new: true,
      },
    );
    return result as T;
  }

  async delete(id: string): Promise<boolean> {
    const delete_item = await this.model.findById(id);
    if (!delete_item) {
      return false;
    }
    return !!(await this.model.findByIdAndDelete(id));
  }
}
