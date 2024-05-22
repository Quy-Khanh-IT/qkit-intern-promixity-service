import { IsNotEmpty } from 'class-validator';

export class TokenPayload {
  @IsNotEmpty()
  user_id: string;
  @IsNotEmpty()
  action: string;
}

export default TokenPayload;
