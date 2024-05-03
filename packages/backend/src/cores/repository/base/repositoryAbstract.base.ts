import { Model, FilterQuery, QueryOptions } from 'mongoose';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import { BaseRepositoryInterface } from './repostioryInterface.base';
import { BaseEntity } from 'src/cores/entity/base/entity.base';
import { transObjectIdToString } from 'src/common/utils';

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
    const result = (await this.model.findById(id).lean().exec()) as T;
    if (result) {
      result.id = transObjectIdToString(result._id);
    }
    return result;
  }

  async findOneByCondition(condition = {}): Promise<T | null> {
    const result = (await this.model
      .findOne({
        ...condition,
      })
      .lean()
      .exec()) as T;
    if (result) {
      result.id = transObjectIdToString(result._id);
    }
    return result;
  }


/*



*/



  async findAll(
    condition: FilterQuery<T>,
    options?: QueryOptions<T>,
  ): Promise<FindAllResponse<T>> {
    const items = (await this.model
      .find({ ...condition }, options?.projection, options)
      .lean()
      .exec()) as T[];

    if (items.length) {
      items.forEach(
        (Element) => (Element.id = transObjectIdToString(Element._id)),
      );
    }
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
    if (result) {
      result.id = transObjectIdToString(result._id);
    }
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
