import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/common/decorators/role.decorator';
import { UserRole } from 'src/common/enums';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import { RoleGuard } from 'src/cores/guard/role.guard';
import { StatisticUserBusinessDto } from './dto/statistic-user-business.dto';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
@ApiTags('Statistics')
@Roles(UserRole.ADMIN)
@UseGuards(JwtAccessTokenGuard, RoleGuard)
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('categories')
  @HttpCode(200)
  async getCategoryStatistics() {
    return await this.statisticsService.getCategoryStatistics();
  }

  @Get('businesses-users')
  @HttpCode(200)
  async getBusinessUserStatistics(
    @Query() dataQuery: StatisticUserBusinessDto,
  ) {
    const data = plainToClass(StatisticUserBusinessDto, dataQuery);
    return await this.statisticsService.getBusinessUserStatistics(dataQuery);
  }

  @Get('businesses/status')
  @HttpCode(200)
  async getBusinessStatusStatistics() {
    return await this.statisticsService.getBusinessStatusStatistics();
  }
}
