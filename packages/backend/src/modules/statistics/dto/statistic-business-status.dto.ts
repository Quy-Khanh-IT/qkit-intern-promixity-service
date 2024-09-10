export class StatisticStatusObjectDto {
  status: string;

  total: number;
}

export class StatusBusinessStatisticDto {
  total_status: number;

  data: Array<StatisticStatusObjectDto>;
}
