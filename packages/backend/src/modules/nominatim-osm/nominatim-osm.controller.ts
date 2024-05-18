import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
  Query,
} from '@nestjs/common';
import { NominatimOsmService } from './nominatim-osm.service';
import { JwtAccessTokenGuard } from 'src/cores/guard/jwt-access-token.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StructureDto } from './dto/structure.dto';
import { ReverseDto } from './dto/reverse.dto';
import { ParseFloat } from 'src/cores/decorators/parseFloat.decorator';

@Controller('nominatim-oms')
@ApiTags('nominatim-oms')
@ApiBearerAuth()
export class NominatimOmsController {
  constructor(private readonly nominatimOsmService: NominatimOsmService) {}

  @Get('structure')
  @UseGuards(JwtAccessTokenGuard)
  @ApiQuery({ name: 'country', type: 'string', required: true })
  @ApiQuery({ name: 'province', type: 'string', required: true })
  @ApiQuery({ name: 'district', type: 'string', required: true })
  @ApiQuery({ name: 'addressLine', type: 'string', required: true })
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Get structure address successfully.',
  })
  async structure(@Query() structureQuery: StructureDto) {
    const result = await this.nominatimOsmService.structure(structureQuery);

    return result;
  }

  @Get('reverse')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(200)
  @ApiQuery({ name: 'longitude', type: 'string', required: true })
  @ApiQuery({ name: 'latitude', type: 'string', required: true })
  @ApiResponse({
    status: 200,

    description: 'Get reverse address successfully.',
  })
  async reverse(
    @ParseFloat(['longitude', 'latitude']) @Query() reverseQuery: ReverseDto,
  ) {
    const result = await this.nominatimOsmService.reverse(reverseQuery);
    return result;
  }
}
