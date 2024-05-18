import { FindAllResponse } from 'src/common/types/findAllResponse.type';

export type AvailableActionResponse = {
  availableActions: string[];
};

export type ExtendedActionResponse<T> = AvailableActionResponse &
  FindAllResponse<T>;
