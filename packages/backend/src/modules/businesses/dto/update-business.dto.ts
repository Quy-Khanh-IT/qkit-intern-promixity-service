import { PartialType } from '@nestjs/swagger';
import { CreateBusinessDto } from './create-business.dto';

export class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}
