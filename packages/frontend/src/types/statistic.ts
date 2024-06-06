// bar chart
export interface ICategoryStatistic {
  total_category: number
  categories: ICategoryItemStatistic[]
}

export interface ICategoryItemStatistic {
  id: string
  name: string
  total_business: number
}

// spline chart
export interface IBusinessUserStatistic {
  total_business: number
  total_user: number
  data: IBusinessUserStatisticItem[]
}

export interface IBusinessUserStatisticItem {
  time_index: number
  total_business: number
  total_user: number
}
