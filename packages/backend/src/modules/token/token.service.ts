import { Injectable } from '@nestjs/common';
import { TokenRepository } from './repository/token.repository';
import { CreateTokenDto } from './dto/create-token.dto';
import { Token } from './entities/token.entity';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import { transObjectIdToString, transStringToObjectId } from 'src/common/utils';

@Injectable()
export class TokenService {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async createToken(data: CreateTokenDto): Promise<Token> {
    return await this.tokenRepository.create({
      ...data,
      expiredAt: data.expiredTime,
    });
  }

  async findManyByUserId(
    userId: string,
    limit: number = 5,
    ascending: boolean = false,
  ): Promise<FindAllResponse<Token>> {
    return await this.tokenRepository.findAll(
      { userId: transStringToObjectId(userId) },
      {
        limit: limit,
        sort: { expiredAt: ascending ? 1 : -1 },
      },
    );
  }

  async updateTokenStatus(id: string, isUsed: boolean): Promise<Token> {
    return await this.tokenRepository.update(id, { used: isUsed });
  }
}
