import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { AddressService } from './address.service';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Province } from './entities/province.enity';
import { District } from './entities/district.entity';
import { Ward } from './entities/ward.entity';

@Controller('address')
@ApiTags('Address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  // Address APIs
  @Get('provinces')
  @ApiOkResponse({ description: 'Get all provinces', type: [Province] })
  async getAllProvinces(): Promise<{ count: number; items: Province[] }> {
    return this.addressService.getAllProvinces();
  }

  @Get('districts/:provinceCode')
  @ApiOkResponse({
    description: 'Get all districts by province code',
    type: [District],
  })
  @ApiNotFoundResponse({ description: 'Province not found' })
  async getAllDistrictsByProvinceCode(
    @Param('provinceCode') provinceCode: string,
  ): Promise<{ count: number; items: District[] }> {
   
    return this.addressService.getAllDistrictByProvinceCode(provinceCode);
  }

  @Get('wards/:districtCode')
  @ApiOkResponse({
    description: 'Get all wards by district code',
    type: [Ward],
  })
  @ApiNotFoundResponse({ description: 'District not found' })
  async getAllWardsByDistrictId(
    @Param('districtCode') districtCode: string,
  ): Promise<{ count: number; items: Ward[] }> {
    return this.addressService.getAllWardByDistrictCode(districtCode);
  }

  // Province APIs

  @Post('province')
  @ApiCreatedResponse({ description: 'Create new province', type: Province })
  async createProvince(@Body() provinceData: Province): Promise<Province> {
    return this.addressService.createProvince(provinceData);
  }

  @Get('province/:id')
  @ApiOkResponse({ description: 'Get province by ID', type: Province })
  @ApiNotFoundResponse({ description: 'Province not found' })
  async getProvinceById(@Param('id') id: string): Promise<Province> {
    const province = await this.addressService.getProvinceById(id);
    if (!province) {
      throw new NotFoundException('Province not found');
    }
    return province;
  }

  @Put('province/:id')
  @ApiOkResponse({ description: 'Update province by ID', type: Province })
  @ApiNotFoundResponse({ description: 'Province not found' })
  async updateProvince(
    @Param('id') id: string,
    @Body() provinceData: Province,
  ): Promise<Province> {
    const updatedProvince = await this.addressService.updateProvince(
      id,
      provinceData,
    );
    if (!updatedProvince) {
      throw new NotFoundException('Province not found');
    }
    return updatedProvince;
  }

  @Delete('province/:id')
  @ApiOkResponse({ description: 'Delete province by ID' })
  @ApiNotFoundResponse({ description: 'Province not found' })
  async deleteProvince(@Param('id') id: string): Promise<void> {
    const deleted = await this.addressService.deleteProvince(id);
    if (!deleted) {
      throw new NotFoundException('Province not found');
    }
  }

  // District APIs

  @Post('district')
  @ApiCreatedResponse({ description: 'Create new district', type: District })
  async createDistrict(@Body() districtData: District): Promise<District> {
    return this.addressService.createDistrict(districtData);
  }

  @Get('district/:id')
  @ApiOkResponse({ description: 'Get district by ID', type: District })
  @ApiNotFoundResponse({ description: 'District not found' })
  async getDistrictById(@Param('id') id: string): Promise<District> {
    const district = await this.addressService.getDistrictById(id);
    if (!district) {
      throw new NotFoundException('District not found');
    }
    return district;
  }

  @Put('district/:id')
  @ApiOkResponse({ description: 'Update district by ID', type: District })
  @ApiNotFoundResponse({ description: 'District not found' })
  async updateDistrict(
    @Param('id') id: string,
    @Body() districtData: District,
  ): Promise<District> {
    const updatedDistrict = await this.addressService.updateDistrict(
      id,
      districtData,
    );
    if (!updatedDistrict) {
      throw new NotFoundException('District not found');
    }
    return updatedDistrict;
  }

  @Delete('district/:id')
  @ApiOkResponse({ description: 'Delete district by ID' })
  @ApiNotFoundResponse({ description: 'District not found' })
  async deleteDistrict(@Param('id') id: string): Promise<void> {
    const deleted = await this.addressService.deleteDistrict(id);
    if (!deleted) {
      throw new NotFoundException('District not found');
    }
  }

  // Ward APIs

  @Post('ward')
  @ApiCreatedResponse({ description: 'Create new ward', type: Ward })
  async createWard(@Body() wardData: Ward): Promise<Ward> {
    return this.addressService.createWard(wardData);
  }

  @Get('ward/:id')
  @ApiOkResponse({ description: 'Get ward by ID', type: Ward })
  @ApiNotFoundResponse({ description: 'Ward not found' })
  async getWardById(@Param('id') id: string): Promise<Ward> {
    const ward = await this.addressService.getWardById(id);
    if (!ward) {
      throw new NotFoundException('Ward not found');
    }
    return ward;
  }

  @Put('ward/:id')
  @ApiOkResponse({ description: 'Update ward by ID', type: Ward })
  @ApiNotFoundResponse({ description: 'Ward not found' })
  async updateWard(
    @Param('id') id: string,
    @Body() wardData: Ward,
  ): Promise<Ward> {
    const updatedWard = await this.addressService.updateWard(id, wardData);
    if (!updatedWard) {
      throw new NotFoundException('Ward not found');
    }
    return updatedWard;
  }

  @Delete('ward/:id')
  @ApiOkResponse({ description: 'Delete ward by ID' })
  @ApiNotFoundResponse({ description: 'Ward not found' })
  async deleteWard(@Param('id') id: string): Promise<void> {
    const deleted = await this.addressService.deleteWard(id);
    if (!deleted) {
      throw new NotFoundException('Ward not found');
    }
  }
}
