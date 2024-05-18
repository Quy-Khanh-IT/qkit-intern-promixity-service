import { FindAllResponse } from 'src/common/types/findAllResponse.type';

export interface BaseRepositoryInterface<T> {
  create(dto: T | any): Promise<T>; //Unknown

  findOneById(id: string, projection?: string): Promise<T>;

  findOneByCondition(condition?: object, projection?: string): Promise<T>;

  findAll(condition: object, options?: object): Promise<FindAllResponse<T>>;

  findAllWithDeleted(
    condition: object,
    options?: object,
  ): Promise<FindAllResponse<T>>;

  update(id: string, dto: Partial<T>): Promise<T>;

  hardDelete(id: string): Promise<boolean>;

  restore(id: string): Promise<T>;

  softDelete(id: string): Promise<boolean>;
}
