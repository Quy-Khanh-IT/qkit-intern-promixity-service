import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';
import { TypeRequests } from 'src/common/enums';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  userId: ObjectId;

  @IsNotEmpty()
  expiredTime: number;

  @IsEnum(TypeRequests)
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  @IsBoolean()
  used: boolean;
}
