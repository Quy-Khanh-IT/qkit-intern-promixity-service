import { ObjectId } from 'mongoose';
import { Prop } from '@nestjs/mongoose';
import { IsBoolean, IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  userId: ObjectId;

  @IsNotEmpty()
  expiredTime: number;

  @IsNotEmpty()
  @IsBoolean()
  used: boolean;
}
