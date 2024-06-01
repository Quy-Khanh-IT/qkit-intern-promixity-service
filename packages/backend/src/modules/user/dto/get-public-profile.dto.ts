import { IsEmail, IsString, IsUrl } from 'class-validator';

export class GetPublicProfileResponeDto {
  @IsString()
  id: string;
  @IsEmail()
  email: string;
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsUrl()
  image: string;
}
