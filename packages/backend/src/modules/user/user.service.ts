import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as Dayjs from 'dayjs';
import { ConfigKey, UserConstant } from 'src/common/constants';
import { TypeRequests } from 'src/common/enums';
import {
  InvalidTokenException,
  WrongCredentialsException,
} from 'src/common/exceptions';
import {
  ConfirmPassNotMatchException,
  NewPassNotMatchOldException,
  UserAlreadyExistException,
} from 'src/common/exceptions/user.exception';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import { hashString, verifyHash } from 'src/common/utils';
import TokenPayload from '../auth/key.payload';
import { MailService } from '../mail/mail.service';
import { RequestService } from '../request/request.service';
import { UploadFileService } from '../upload-file/upload-file.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequesUpdateEmail } from './dto/request-update-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdateGeneralInfoDto } from './dto/update-general-info.dto';
import { UpdateGeneralInfoResponseDto } from './dto/update-general-info.response.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
  Injectable,
  InternalServerErrorException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Business } from '../business/entities/business.entity';
import { BusinessService } from '../business/business.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly uploadFileService: UploadFileService,
    private readonly mailService: MailService,
    private readonly requestService: RequestService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    // @Inject(forwardRef(() => BusinessService))
    private readonly BusinessService: BusinessService,
  ) {}

  async findAll(): Promise<FindAllResponse<User>> {
    return await this.userRepository.findAll({});
  }

  async softDeleteById(id: string): Promise<boolean> {
    return await this.userRepository.softDelete(id);
  }

  async hardDeleteById(id: string): Promise<boolean> {
    return await this.userRepository.hardDelete(id);
  }

  async checkEmailExist(email: string): Promise<boolean> {
    const result = await this.userRepository.findOneByCondition({
      email: email,
    });
    return result ? true : false;
  }

  async updatePassword(id: string, password: string): Promise<User> {
    const user = await this.userRepository.update(id, { password });
    return user;
  }

  verifyUserFromToken(userRequestId: string, userTokenId: string): boolean {
    return userRequestId === userTokenId;
  }

  async changePassword(
    data: ChangePasswordDto,
    userFromToken: User,
    userIdRequest: string,
  ): Promise<boolean> {
    if (!this.verifyUserFromToken(userIdRequest, userFromToken.id)) {
      throw new InternalServerErrorException('Not allow to change password');
    }
    const { confirmPassword, newPassword, oldPassword } = data;
    if (newPassword !== confirmPassword) {
      throw new ConfirmPassNotMatchException();
    }
    const isMatchingPass = await verifyHash(
      userFromToken.password,
      oldPassword,
    );
    if (!isMatchingPass) {
      throw new NewPassNotMatchOldException();
    }

    const newHashedPass = await hashString(newPassword);
    const result = await this.updatePassword(userFromToken.id, newHashedPass);
    if (!result) {
      throw new InternalServerErrorException('Not success reset password');
    }

    return true;
  }

  async updateGeneralInfo(
    updateGeneralInfo: UpdateGeneralInfoDto,
    userFromToken: User,
    userIdRequest: string,
  ): Promise<UpdateGeneralInfoResponseDto> {
    if (!this.verifyUserFromToken(userIdRequest, userFromToken.id)) {
      throw new InvalidTokenException();
    }
    const address = this.createAddressObjectForUpdate(updateGeneralInfo);
    // Not yet validate address because API of it is also lack of
    const result = await this.userRepository.update(userIdRequest, {
      ...updateGeneralInfo,
      address: {
        ...address,
      },
    });

    if (!result) {
      throw new InternalServerErrorException('Update general info failed');
    }

    return {
      id: result.id,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      image: result.image,
      phoneNumber: result.phoneNumber,
      address: result.address,
    };
  }

  async requestResetEmail(
    data: RequesUpdateEmail,
    userFromToken: User,
    userIdRequest: string,
  ): Promise<boolean> {
    if (!this.verifyUserFromToken(userIdRequest, userFromToken.id)) {
      throw new InvalidTokenException();
    }
    const isPasswordMatching = await verifyHash(
      userFromToken.password,
      data.password,
    );

    if (!isPasswordMatching) {
      throw new WrongCredentialsException();
    }

    const isExistingEmail = await this.userRepository.findOneByCondition({
      email: data.email,
    });

    if (isExistingEmail) {
      throw new UserAlreadyExistException();
    }

    const requests = await this.requestService.findManyByUserIdAndType(
      userFromToken.id,
      TypeRequests.RESET_EMAIL,
    );

    if (requests.count >= UserConstant.MAX_RESET_EMAIL_REQUEST) {
      throw new BadRequestException(
        'You have reached the limit of request to reset email',
      );
    }

    const newJWTToken = await this.generateTokenForResetEmail({
      user_id: userIdRequest,
      action: 'reset email',
    });

    const expiredTime = Dayjs()
      .add(
        this.configService.get<number>(
          ConfigKey.JWT_REQUEST_TOKEN_EXPIRATION_TIME,
        ),
        'seconds',
      )
      .valueOf();

    await this.requestService.createRequest({
      used: false,
      expiredTime: expiredTime,
      token: newJWTToken,
      metaData: { newEmail: data.email },
      userId: userFromToken._id,
      type: TypeRequests.RESET_EMAIL,
    });

    const resetlink = `${this.configService.get<string>(ConfigKey.FRONT_END_URL)}/reset-email?token=${newJWTToken}`;
    this.mailService.sendResetEmailMail(
      data.email,
      'Reset email link',
      resetlink,
    );

    return true;
  }

  async resetEmail(
    token: string,
    userFromToken: User,
    userRequestId: string,
  ): Promise<boolean> {
    if (!this.verifyUserFromToken(userRequestId, userFromToken.id)) {
      throw new InvalidTokenException();
    }
    const requests = await this.requestService.findManyByUserIdAndType(
      userFromToken.id,
      TypeRequests.RESET_EMAIL,
    );

    const isTokenMatching = requests.items[0].token === token;

    if (!isTokenMatching) {
      throw new InvalidTokenException();
    }

    await this.requestService.updateRequestStatus(requests.items[0].id, true);

    const result = await this.userRepository.update(userFromToken.id, {
      email: requests.items[0].metaData['newEmail'],
    });

    if (!result) {
      throw new InternalServerErrorException();
    }

    return true;
  }

  generateTokenForResetEmail(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: `${this.configService.get<number>(ConfigKey.REQUEST_SECRET_KEY)}`,
      expiresIn: `${this.configService.get<string>(
        ConfigKey.JWT_REQUEST_TOKEN_EXPIRATION_TIME,
      )}s`,
    });
  }

  async updateEmail(data: UpdateEmailDto, user: User) {}

  /*
  Not yet handling deleting the old image of user
  */
  async updateImage(
    userFromToken: User,
    userRequestId: string,
    imageFile: Express.Multer.File,
  ): Promise<boolean> {
    if (!this.verifyUserFromToken(userRequestId, userFromToken.id)) {
      throw new InvalidTokenException();
    }
    const path = (
      await this.uploadFileService.uploadImageToCloudinary(imageFile)
    ).secure_url;

    if (!path) {
      throw new InternalServerErrorException();
    }

    const result = await this.userRepository.update(userFromToken.id, {
      image: path,
    });

    if (!result) {
      throw new InternalServerErrorException();
    }
    return true;
  }

  createAddressObjectForUpdate(data: UpdateGeneralInfoDto): {
    city: string;
    province: string;
    country: string;
  } {
    if (!data.city || !data.province || !data.country) {
      throw new BadRequestException(
        'Address must have all 3 fields(city, province, country) or leave it all blank',
      );
    }
    return {
      city: data.city,
      province: data.province,
      country: data.country,
    };
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneByCondition({ email });
  }

  async findOneById(id: string): Promise<User> {
    return await this.userRepository.findOneById(id);
  }

  async delete() {
    return this.userRepository.hardDelete('655ab2ba456d22a01c27972c');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(createUserDto);
    return user;
  }

  async addBusiness(userId: string, businessId: string): Promise<User> {
    console.log('businessId', businessId);

    const update = {
      $addToSet: { businesses: businessId },
    } as Partial<User>;

    const user = await this.userRepository.update(userId, update);

    console.log('user', user);

    if (!user) {
      throw new InternalServerErrorException('Update business failed');
    }
    return user;
  }

  async removeBusiness(userId: string, businessId: string): Promise<User> {
    const update = {
      $pull: { businesses: businessId },
    } as Partial<User>;

    const user = await this.userRepository.update(userId, update);

    if (!user) {
      throw new InternalServerErrorException('Remove business failed');
    }
    return user;
  }

  async getAllBusiness(user: User): Promise<FindAllResponse<Business> | []> {
    const businesses = await this.BusinessService.getAllByCurrentUser(user);

    return businesses;
  }
}
