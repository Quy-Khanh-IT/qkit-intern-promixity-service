export interface IGetReviewOfBusinessPayload {
  businessId: string
  offset?: number
  limit?: number
  startDate?: string
  endDate?: string
  sortBy?: string
  starsRating?: string[]
}

export interface IGetReviewOfBusinessResponse {
  currentPage: number
  pageSize: number
  totalPages: number
  totalRecords: number
  data: IReview[]
}

export interface IReview {
  page: number
  postBy: IReviewOwner
  content: string
  type: string
  star: number
  reportedCount: number
  id: string
  reply: {
    currentPage: number
    pageSize: number
    totalPages: number
    data?: IReply[]
  }
  created_at: string
  updated_at: string
}

export interface IReply {
  postBy: IReviewOwner
  _page: number
  content: string
  id: string
  review_id: string
  replies: IReplyReply[]
  created_at?: string
  updated_at?: string
}

export interface IReplyReply {
  postBy: IReviewOwner
  content: string
  id: string
  review_id: string
  parent_id: string
  replies: IReplyReply[]
  created_at?: string
  updated_at?: string
}

export interface IReviewOwner {
  firstName: string
  lastName?: string
  avatarUrl: string
  user_id: string
}

export interface ICreateReviewPayload {
  content: string
  star: string
  businessId: string
  emotion: string
}

export interface ICreateCommentPayload {
  reviewId: string
  content: string
}

export interface ICreateResponseCommentPayload {
  commentId: string
  content: string
}

export interface IEmotions {
  [key: string]: string
}
