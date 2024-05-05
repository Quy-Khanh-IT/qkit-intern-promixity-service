import { Model, FilterQuery, QueryOptions } from 'mongoose';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import {
  BaseRepositoryInterface,
  BaseSoftDeleteRepositoryInterface,
} from './repositoryInterface.base';
import { BaseEntity } from 'src/cores/entity/base/entity.base';
import { transObjectIdToString } from 'src/common/utils';
import { SoftDeleteModel, SoftDeleteDocument } from 'mongoose-delete';

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

export abstract class SoftDeleteBaseRepositoryAbstract<
  T extends SoftDeleteDocument,
> implements BaseSoftDeleteRepositoryInterface<T>
{
  protected constructor(private readonly model: SoftDeleteModel<T>) {
    this.model = model;
  }
  async softDelete(id: string): Promise<boolean> {
    const delete_item = (await this.model.findById(id).lean().exec()) as T;

    if (!delete_item) {
      return false;
    }
    return !!(await this.model.delete({ _id: id }));
  }

  async forceDelete(id: string): Promise<boolean> {
    const delete_item = (await this.model
      .findOneDeleted({
        _id: id,
      } as FilterQuery<T>)
      .lean()
      .exec()) as T;

    if (!delete_item) {
      return false;
    }

    if (!delete_item.deleted) {
      return false;
    }

    const result = await this.model.deleteOne({ _id: id } as FilterQuery<T>);

    return !!result;
  }

  async restore(id: string): Promise<boolean> {
    const delete_item = await this.model.findOneDeleted({
      _id: id,
    } as FilterQuery<T>);

    if (!delete_item) {
      return false;
    }

    if (!delete_item.deleted) {
      return false;
    }

    const result = (await this.model
      .findOneAndUpdateDeleted({ _id: id } as FilterQuery<T>, {
        deleted: false,
        deletedAt: null,
      })
      .lean()
      .exec()) as T;

    return !!result;
  }
}
