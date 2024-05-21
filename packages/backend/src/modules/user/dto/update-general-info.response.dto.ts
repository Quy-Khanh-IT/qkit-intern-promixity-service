import { ApiProperty } from '@nestjs/swagger';

export class UpdateGeneralInfoResponseDto {
  @ApiProperty({ example: '213123sdasadasdqweqhw12' })
  id: string;

  @ApiProperty({ example: 'example123@gmail.com' })
  email: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  image: string;

  @ApiProperty({ example: '0389185482' })
  phoneNumber: string;
}
