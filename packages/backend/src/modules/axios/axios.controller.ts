import { Controller } from '@nestjs/common';
import { AxiosService } from './axios.service';

@Controller('axios')
export class AxiosController {
  constructor(private readonly axiosService: AxiosService) {}
}
