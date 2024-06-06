export class StatisticCategoryResponseDto {
  total_category: number;
  categories: Array<{
    id: string;
    name: string;
    total_business: number;
  }>;
}
