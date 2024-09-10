import { BaseRepositoryInterface } from 'src/cores/repository/base/repositoryInterface.base';
import { Requests } from '../entities/request.entity';

export interface BaseRequestRepositoryInterface
  extends BaseRepositoryInterface<Requests> {
  populateWithCondition(
    condition: object,
    fieldNameForPopulate: string,
  ): Promise<Requests>;

  findOneWithConditionAndReplace(
    condition: object,
    newRequest: Requests,
  ): Promise<Requests>;
}
