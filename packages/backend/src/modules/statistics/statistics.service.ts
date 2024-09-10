import { Injectable } from '@nestjs/common';
import { PipelineStage } from 'mongoose';
import { BusinessStatusEnum } from 'src/common/enums';
import { StatusBusinessStatisticDto } from './dto/statistic-business-status.dto';
import { StatisticCategoryResponseDto } from './dto/statistic-category.response.dto';
import {
  BusinessStatusStatisticEnum,
  StatisticUserBusinessDto,
  UserStatusStatisticEnum,
} from './dto/statistic-user-business.dto';
import {
  TimeLineObject,
  TimeLineResponseDto,
} from './dto/statistic-user-business.response.dto';
import { BusinessRepository } from './repository/business.repository';
import { CategoryRepository } from './repository/category.repository';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly businessRepository: BusinessRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getCategoryStatistics(): Promise<StatisticCategoryResponseDto> {
    const categories = await this.categoryRepository.aggregate([
      {
        $lookup: {
          from: 'businesses',
          localField: '_id',
          foreignField: 'category._id',
          as: 'businesses',
        },
      },
      {
        $match: {
          'businesses.status': BusinessStatusEnum.APPROVED,
        },
      },
      {
        $project: {
          id: { $toString: '$_id' },
          _id: 0,
          name: 1,
          total_business: { $size: '$businesses' },
        },
      },
    ]);
    return {
      total_category: categories.length,
      categories: categories,
    };
  }

  async getBusinessStatusStatistics(): Promise<StatusBusinessStatisticDto> {
    const status = await this.businessRepository.aggregate([
      {
        $group: {
          _id: '$status',
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          status: '$_id',
          total: 1,
          _id: 0,
        },
      },
    ]);

    return {
      total_status: status.length,
      data: status,
    };
  }

  async getBusinessUserStatistics(dataQuery: StatisticUserBusinessDto) {
    if (dataQuery.timeline === 'month') {
      return await this.getMonthTimeLine(
        dataQuery.year,
        dataQuery.month,
        dataQuery,
      );
    }
    return await this.getYearTimeLine(dataQuery.year, dataQuery);
  }

  configUserStatistics(dataQuery: StatisticUserBusinessDto) {
    let matchStage = {};
    if (dataQuery.statusUser != UserStatusStatisticEnum.ALL) {
      if (dataQuery.statusUser == UserStatusStatisticEnum.ACTIVE) {
        matchStage['deleted_at'] = { $eq: null };
      } else {
        matchStage['deleted_at'] = { $ne: null };
      }
    }
    return matchStage;
  }

  configBusinessStatistics(dataQuery: StatisticUserBusinessDto) {
    let matchStage = {};
    if (dataQuery.statusBusiness != BusinessStatusStatisticEnum.ALL) {
      if (dataQuery.statusBusiness === BusinessStatusStatisticEnum.DELETED) {
        matchStage['deleted_at'] = { $eq: null };
      } else {
        matchStage['status'] = dataQuery.statusBusiness;
        matchStage['deleted_at'] = { $ne: null };
      }
    }
    return matchStage;
  }

  async getMonthTimeLine(
    year: number,
    month: number,
    dataQuery: StatisticUserBusinessDto,
  ): Promise<TimeLineResponseDto> {
    const baseMatchStage = {
      created_at: {
        $gte: new Date(`${year}-${month}-01`),
        $lte: new Date(`${year}-${month}-31`),
      },
    };

    let businessMatchStage: PipelineStage = {} as PipelineStage,
      userMatchStage: PipelineStage = {} as PipelineStage;

    businessMatchStage = {
      $match: {
        ...baseMatchStage,
        ...this.configBusinessStatistics(dataQuery),
      },
    };

    userMatchStage = {
      $match: {
        ...baseMatchStage,
        ...this.configUserStatistics(dataQuery),
      },
    };

    const businessStats = await this.businessRepository.aggregate([
      {
        ...businessMatchStage,
      },
      {
        $group: {
          _id: { $dayOfMonth: '$created_at' },
          total_business: { $sum: 1 },
        },
      },
      {
        $project: {
          day: '$_id',
          total_business: 1,
          _id: 0,
        },
      },
    ]);

    const userStats = await this.userRepository.aggregate([
      {
        ...userMatchStage,
      },
      {
        $group: {
          _id: { $dayOfMonth: '$created_at' },
          total_user: { $sum: 1 },
        },
      },
      {
        $project: {
          day: '$_id',
          total_user: 1,
          _id: 0,
        },
      },
    ]);

    const daysInMonth = new Date(year, month, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const result: TimeLineObject[] = days.map((day) => {
      const businessStat = businessStats.find((stat) => stat.day === day);
      const userStat = userStats.find((stat) => stat.day === day);

      return {
        time_index: day,
        total_business: businessStat ? businessStat.total_business : 0,
        total_user: userStat ? userStat.total_user : 0,
      };
    });

    const total_business = result.reduce((sum, m) => sum + m.total_business, 0);
    const total_user = result.reduce((sum, m) => sum + m.total_user, 0);

    return {
      total_business,
      total_user,
      data: result,
    };
  }

  async getYearTimeLine(
    year: number,
    dataQuery: StatisticUserBusinessDto,
  ): Promise<TimeLineResponseDto> {
    // Initialize months array for the whole year

    const months: TimeLineObject[] = Array.from({ length: 12 }, (_, i) => ({
      time_index: i + 1,
      total_business: 0,
      total_user: 0,
    }));

    const baseMatchStage = {
      created_at: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    };

    let businessMatchStage: PipelineStage = {} as PipelineStage,
      userMatchStage: PipelineStage = {} as PipelineStage;

    businessMatchStage = {
      $match: {
        ...baseMatchStage,
        ...this.configBusinessStatistics(dataQuery),
      },
    };

    userMatchStage = {
      $match: {
        ...baseMatchStage,
        ...this.configUserStatistics(dataQuery),
      },
    };

    const businessStats = await this.businessRepository.aggregate([
      {
        ...businessMatchStage,
      },
      {
        $group: {
          _id: { $month: '$created_at' },
          total_business: { $sum: 1 },
        },
      },
      {
        $project: {
          month: '$_id',
          total_business: 1,
          _id: 0,
        },
      },
    ]);

    const userStats = await this.userRepository.aggregate([
      {
        ...userMatchStage,
      },
      {
        $group: {
          _id: { $month: '$created_at' },
          total_user: { $sum: 1 },
        },
      },
      {
        $project: {
          month: '$_id',
          total_user: 1,
          _id: 0,
        },
      },
    ]);
    // Merge the results with the initialized months
    businessStats.forEach((stat) => {
      const index = stat.month - 1;
      months[index].total_business = stat.total_business;
    });

    userStats.forEach((stat) => {
      const index = stat.month - 1;
      months[index].total_user = stat.total_user;
    });

    const total_business = months.reduce((sum, m) => sum + m.total_business, 0);
    const total_user = months.reduce((sum, m) => sum + m.total_user, 0);

    return {
      total_business,
      total_user,
      data: months,
    };
  }
}
