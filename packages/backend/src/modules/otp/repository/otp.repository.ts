import { BaseRepositoryAbstract } from 'src/cores/repository/base/repositoryAbstract.base';
import { OTP } from '../entities/otp.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class OtpRepository extends BaseRepositoryAbstract<OTP> {
  constructor(@InjectModel(OTP.name) private readonly otpModel: Model<OTP>) {
    super(otpModel);
  }
}
