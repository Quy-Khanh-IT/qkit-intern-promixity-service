export interface Province {
  code: string
  name: string
  name_en: string
  full_name: string
  full_name_en: string
  code_name: string
}

export interface District {
  code: string
  name: string
  name_en: string
  full_name: string
  full_name_en: string
  code_name: string
  province_code: string
}

export interface ProvincesQueryResponse {
  data: {
    items: Province[]
  }
  isSuccess: boolean
}

export interface DistrictsQueryResponse {
  data: {
    items: District[]
  }
  isSuccess: boolean
}
