import * as moment from 'moment';
import { PipelineStage } from 'mongoose';
import { BaseEntity } from 'src/cores/entity/base/entity.base';
import { NoDateQueryFilterBase } from 'src/cores/pagination/base/no-date-query-filter.base';
import {
  NotificationPaginationResult,
  PaginationResult,
} from 'src/cores/pagination/base/pagination-result.base';
import { QueryFilterBase } from 'src/cores/pagination/base/query-filter.base';
import { BaseRepositoryAbstract } from 'src/cores/repository/base/repositoryAbstract.base';
import { CommentFilter } from 'src/modules/review/dto/comment-filter.dto';
import { transStringToObjectId } from '../utils';

export class PaginationHelper {
  private static createLink(queryData: any, URL: string, totalPage: number) {
    const offset = queryData.offset;
    const limit = queryData.limit;
    const firstLink = this.createQueryParams({ ...queryData, offset: 1 });
    const lastLink = this.createQueryParams({
      ...queryData,
      offset: totalPage,
    });
    const previousLink = this.createQueryParams({
      ...queryData,
      offset: offset - 1,
    });
    const nextLink = this.createQueryParams({
      ...queryData,
      offset: offset + 1,
    });

    let links = {
      first: `${URL}?${firstLink}`,
      previous: offset - 1 > 0 ? `${URL}?${previousLink}` : null,
      next: offset + 1 <= totalPage ? `${URL}?${nextLink}` : null,
      last: `${URL}?${lastLink}`,
    };

    return links;
  }

  public static configureBaseQueryFilter(
    matchStage: Record<string, any>,
    sortStage: Record<string, any>,
    data: QueryFilterBase | NoDateQueryFilterBase | CommentFilter,
  ): { matchStage: Record<string, any>; sortStage: Record<string, any> } {
    if (data?.startDate) {
      matchStage['created_at'] = {
        $gte: moment(data.startDate, 'DD/MM/YYYY').toDate(),
      };
    }
    if (data.endDate) {
      matchStage['created_at'] = {
        ...matchStage['created_at'],
        $lte: moment(data.endDate, 'DD/MM/YYYY').toDate(),
      };
    }
    if (data.sortBy) {
      sortStage['created_at'] = data.sortBy === 'asc' ? 1 : -1;
    }

    matchStage['deleted_at'] = data.isDeleted ? { $ne: null } : { $eq: null };
    return { matchStage, sortStage };
  }

  private static createQueryParams(queryFilter: Object): string {
    let queryParams = Object.keys(queryFilter)
      .filter(
        (key) => queryFilter[key] !== undefined && queryFilter[key] !== null,
      )
      .map((key) => `${key}=${encodeURIComponent(queryFilter[key])}`)
      .join('&');

    return queryParams ? `${queryParams}` : '';
  }

  static async paginate<
    T extends BaseEntity,
    V extends QueryFilterBase | NoDateQueryFilterBase | CommentFilter,
  >(
    URL: string,
    queryData: V,
    repository: BaseRepositoryAbstract<T>,
    createOptionalPipeline?: (queryData: V) => Promise<PipelineStage[]>,
  ): Promise<PaginationResult<T>> {
    let basePipeline: PipelineStage[] = [
      {
        $facet: {
          data: [
            { $skip: (queryData.offset - 1) * queryData.limit },
            { $limit: queryData.limit },
          ],
          totalCount: [{ $count: 'total' }],
        },
      },

      {
        $project: {
          data: 1,
          count: { $size: '$data' },
          totalRecords: { $arrayElemAt: ['$totalCount.total', 0] },
          totalPages: {
            $ceil: {
              $divide: [
                { $arrayElemAt: ['$totalCount.total', 0] },
                queryData.limit,
              ],
            },
          },
        },
      },
    ];

    if (createOptionalPipeline) {
      const optionalPipeline: PipelineStage[] =
        await createOptionalPipeline(queryData);
      if (optionalPipeline && optionalPipeline.length > 0) {
        basePipeline = [...optionalPipeline, ...basePipeline];
      }
    }

    let result: any[] = await repository.aggregate(basePipeline);
    return {
      currentPage: queryData.offset,
      data: result[0]['data'],
      links: this.createLink(queryData, URL, result[0]['totalPages']),
      pageSize: result[0]['count'],
      totalPages: result[0]['totalPages'],
      totalRecords: result[0]['totalRecords'],
    };
  }

  static async commentPaginate<T extends BaseEntity, V extends CommentFilter>(
    reviewId: string,
    URL: string,
    queryData: V,
    repository: BaseRepositoryAbstract<T>,
    createOptionalPipeline?: (queryData: V) => Promise<PipelineStage[]>,
  ): Promise<PaginationResult<T>> {
    let basePipeline: PipelineStage[] = [
      {
        $sort: { page: 1 },
      },
      {
        $match: {
          reviewId: transStringToObjectId(reviewId),
          page: { $ne: null },
        },
      },
      {
        $facet: {
          data: [{ $skip: queryData.offset - 1 }, { $limit: 1 }],
          totalCount: [{ $count: 'total' }],
        },
      },

      {
        $project: {
          data: 1,
          count: { $size: '$data' },
          totalRecords: { $arrayElemAt: ['$totalCount.total', 0] },
          totalPages: {
            $ceil: {
              $divide: [
                { $arrayElemAt: ['$totalCount.total', 0] },
                queryData.limit,
              ],
            },
          },
        },
      },
    ];

    if (createOptionalPipeline) {
      const optionalPipeline: PipelineStage[] =
        await createOptionalPipeline(queryData);
      if (optionalPipeline && optionalPipeline.length > 0) {
        basePipeline = [...optionalPipeline, ...basePipeline];
      }
    }

    let result: any[] = await repository.aggregate(basePipeline);
    return {
      currentPage: queryData.offset,
      data: result[0]['data'],
      links: this.createLink(queryData, URL, result[0]['totalPages']),
      pageSize: result[0]['count'],
      totalPages: result[0]['totalPages'],
      totalRecords: result[0]['totalRecords'],
    };
  }
}
