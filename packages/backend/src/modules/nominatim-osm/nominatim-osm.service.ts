import { Injectable } from '@nestjs/common';
import { StructureDto } from './dto/structure.dto';
import { ReverseDto } from './dto/reverse.dto';
import { ConfigService } from '@nestjs/config';
import { AxiosService } from '../axios/axios.service';
import { buildQueryParams } from 'src/common/utils';

@Injectable()
export class NominatimOsmService {
  osmStructureApi: string;
  osmReverseApi: string;
  optsParam: object;

  constructor(
    private readonly configService: ConfigService,
    private readonly axiosService: AxiosService,
  ) {
    this.osmStructureApi = this.configService.get<string>(
      'API_OSM_STRUCTURE_URL',
    );
    this.osmReverseApi = this.configService.get<string>('API_OSM_REVERSE_URL');

    this.optsParam = {
      format: 'jsonv2',
      addressdetails: 1,
      'accept-language': 'vi',
    };
  }

  async structure(structureDto: StructureDto): Promise<any> {
    const constructor = {
      country: structureDto.country,
      city: structureDto.district,
      state: structureDto.province,
      street: structureDto.addressLine,
    };

    const params = { ...constructor, ...this.optsParam };

    const queryParams = buildQueryParams(params);

    const url = this.osmStructureApi + queryParams;

    const data = await this.axiosService.processRetry(url);

    return data;
  }

  async reverse(reverseDto: ReverseDto) {
    const constructor = {
      lon: reverseDto.longitude,
      lat: reverseDto.latitude,
    };

    const params = { ...constructor, ...this.optsParam };

    const queryParams = buildQueryParams(params);

    const url = this.osmReverseApi + queryParams;

    console.log('testGet');
    // const data = await this.axiosService.processRetry(url);
    const data = await this.axiosService.testGet(url);

    // console.log('data', data);

    return data;
  }
}
