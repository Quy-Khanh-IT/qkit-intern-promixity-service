export class TimeLineResponseDto {
  total_business: number;
  total_user: number;
  data: Array<TimeLineObject>;
}

export class TimeLineObject {
  time_index: number;
  total_business: number;
  total_user: number;
}
