import { InjectModel } from '@nestjs/mongoose';
import { Token } from './../entities/token.entity';
import { BaseRepositoryAbstract } from 'src/cores/repository/base/repositoryAbstract.base';
import { Model } from 'mongoose';

export class TokenRepository extends BaseRepositoryAbstract<Token> {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {
    super(tokenModel);
  }
}
