import {
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import * as Dayjs from 'dayjs';
import { PipelineStage } from 'mongoose';
import { ConfigKey, UserConstant } from 'src/common/constants';
import {
  DeleteType,
  TypeRequests,
  UserRole,
  UserStatus,
} from 'src/common/enums';
import {
  InvalidTokenException,
  OTPNotMatchException,
  UnVerifiedUser,
  UnauthorizedException,
  WrongCredentialsException,
} from 'src/common/exceptions';
import {
  ConfirmPassNotMatchException,
  ExceedResetEmailRequestException,
  NewPassNotMatchOldException,
  UserAlreadyExistException,
  UserConflictAdminException,
  UserNotFoundException,
} from 'src/common/exceptions/user.exception';
import { PaginationHelper } from 'src/common/helper';
import { FindAllResponse } from 'src/common/types/findAllResponse.type';
import { hashString, verifyHash } from 'src/common/utils';
import { PaginationResult } from 'src/cores/pagination/base/pagination-result.base';
import TokenPayload from '../auth/key.payload';
import { MailService } from '../mail/mail.service';
import { RequestService } from '../request/request.service';
import { UploadFileService } from '../upload-file/upload-file.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { DeleteUserQueryDto } from './dto/delete-user.query.dto';
import { FindAllUserQuery } from './dto/find-all-user.query.dto';
import { RequesUpdateEmail } from './dto/request-update-email.dto';
import { RestoreResponseDto } from './dto/restore.response.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdateGeneralInfoDto } from './dto/update-general-info.dto';
import { UpdateGeneralInfoResponseDto } from './dto/update-general-info.response.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';

import { BusinessService } from '../business/business.service';
import { OtpService } from '../otp/otp.service';
import { CreateUserDto } from './dto/create-user.dto';
import { GetPublicProfileResponeDto } from './dto/get-public-profile.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly uploadFileService: UploadFileService,
    private readonly mailService: MailService,
    private readonly requestService: RequestService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => OtpService))
    private readonly otpService: OtpService,
    @Inject(forwardRef(() => BusinessService))
    private readonly BusinessService: BusinessService,
  ) {}

  async findAll(): Promise<FindAllResponse<User>> {
    return await this.userRepository.findAll({});
  }

  async getPublicProfile(userId: string): Promise<GetPublicProfileResponeDto> {
    let user = await this.findVerifiedOneWithId(userId);
    if (!user) {
      throw new UserNotFoundException();
    }
    return {
      email: user.email,
      firstName: user.firstName,
      id: user.id,
      image: user.image,
      lastName: user.lastName,
    };
  }

  async getDetailProfile(
    requestedUserId: string,
    status: UserStatus,
    requestUser: User,
  ): Promise<User> {
    if (requestUser.role === UserRole.ADMIN) {
      return await this.getDetailProfileForAdmin(requestedUserId, status);
    }
    return await this.getDetailProfileForUser(requestedUserId, requestUser);
  }

  async getDetailProfileForAdmin(
    userId: string,
    status: UserStatus,
  ): Promise<User> {
    if (status === UserStatus.DELETED) {
      return await this.findOneDeleteById(userId);
    }
    return await this.findOneById(userId);
  }

  async getDetailProfileForUser(
    requestedUserId: string,
    userRequest: User,
  ): Promise<User> {
    if (requestedUserId !== userRequest.id) {
      throw new UnauthorizedException();
    }
    return userRequest;
  }

  getAllRoles(): UserRole[] {
    const allRoles: string[] = Object.values(UserRole).map((element) => {
      return element.toString();
    });
    return allRoles as UserRole[];
  }

  async updateVerifiedStatusByEmail(id: string, status: boolean) {
    return await this.userRepository.update(id, { isVerified: status });
  }

  async softDeleteById(id: string): Promise<boolean> {
    return await this.userRepository.softDelete(id);
  }

  async checkPhoneExist(phone: string): Promise<boolean> {
    const result = await this.userRepository.findOneByCondition({
      phoneNumber: phone,
    });
    return result ? true : false;
  }

  async checkCRUDConditionForAdmin(
    userId: string,
    adminId: string,
  ): Promise<void> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }
    if (adminId === userId) {
      throw new UserConflictAdminException();
    }
  }

  async findOneDeleteById(userId: string): Promise<User> {
    return await this.userRepository.findOneByConditionWithDeleted({
      _id: userId,
    });
  }

  async restore(
    restoreUserId: string,
    adminId: string,
  ): Promise<RestoreResponseDto> {
    const user = await this.findOneDeleteById(restoreUserId);
    if (!user) {
      throw new UserNotFoundException();
    }
    if (adminId === restoreUserId) {
      throw new UserConflictAdminException();
    }
    const result = await this.userRepository.restore(restoreUserId);
    if (!result) {
      throw new InternalServerErrorException();
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      phoneNumber: user.phoneNumber,
    };
  }

  async getAllUser(query: FindAllUserQuery): Promise<PaginationResult<User>> {
    const URL = `http://localhost:${this.configService.get<string>(ConfigKey.PORT)}/admin/users`;
    const aggregateResult = await PaginationHelper.paginate(
      URL,
      query,
      this.userRepository,
      this.configGetAllUserPipeLine,
    );
    const users = aggregateResult.data.map((user) => plainToClass(User, user));
    aggregateResult.data = users;
    return aggregateResult;
  }
  async configGetAllUserPipeLine(
    query: FindAllUserQuery,
  ): Promise<PipelineStage[]> {
    let matchStage: Record<string, any> = {};
    let sortStage: Record<string, any> = {};
    let finalPipeline: PipelineStage[] = [];

    if (query.email) {
      matchStage['email'] = { $regex: new RegExp(`^${query.email}`, 'i') };
    }
    if (query.firstName) {
      matchStage['firstName'] = {
        $regex: new RegExp(`${query.firstName}`, 'i'),
      };
    }
    if (query.role?.length > 0) {
      matchStage['role'] = { $in: query.role };
    }
    if (query.lastName) {
      matchStage['lastName'] = {
        $regex: new RegExp(`${query.lastName}`, 'i'),
      };
    }
    if (query.phone) {
      matchStage['phoneNumber'] = {
        $regex: new RegExp(`${query.phone}`),
      };
    }

    const result = PaginationHelper.configureBaseQueryFilter(
      matchStage,
      sortStage,
      query,
    );
    matchStage = result.matchStage;
    sortStage = result.sortStage;

    if (Object.keys(matchStage).length > 0) {
      finalPipeline.push({ $match: matchStage });
    }

    if (Object.keys(sortStage).length > 0) {
      finalPipeline.push({ $sort: sortStage });
    }

    return finalPipeline;
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
      throw new UnauthorizedException();
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
      throw new UnauthorizedException();
    }

    const result = await this.userRepository.update(userIdRequest, {
      ...updateGeneralInfo,
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
    };
  }

  async requestResetEmail(
    data: RequesUpdateEmail,
    userFromToken: User,
    userIdRequest: string,
  ): Promise<boolean> {
    await this.validateForUpdatingEmail(data, userFromToken, userIdRequest);

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
      metaData: { newEmail: data.newEmail },
      userId: userFromToken._id,
      type: TypeRequests.RESET_EMAIL,
    });

    const resetlink = `${this.configService.get<string>(ConfigKey.FRONT_END_URL)}/reset-email?token=${newJWTToken}`;
    this.mailService.sendResetEmailMail(
      data.newEmail,
      'Reset email link',
      resetlink,
    );

    return true;
  }

  async validateForUpdatingEmail(
    data: RequesUpdateEmail,
    userFromToken: User,
    userIdRequest: string,
  ): Promise<void> {
    if (!this.verifyUserFromToken(userIdRequest, userFromToken.id)) {
      throw new UnauthorizedException();
    }
    const isPasswordMatching = await verifyHash(
      userFromToken.password,
      data.password,
    );

    if (!isPasswordMatching) {
      throw new WrongCredentialsException();
    }

    const isExistingEmail = await this.userRepository.findOneByCondition({
      email: data.newEmail,
    });

    if (isExistingEmail) {
      throw new UserAlreadyExistException();
    }

    const otps = await this.otpService.findManyByEmail(userFromToken.email, 5);

    if (!otps.count || otps.items[0].otp !== data.otp) {
      throw new OTPNotMatchException();
    }

    const requests = await this.requestService.findManyByUserIdAndType(
      userFromToken.id,
      TypeRequests.RESET_EMAIL,
    );

    if (requests.count >= UserConstant.MAX_RESET_EMAIL_REQUEST) {
      throw new ExceedResetEmailRequestException();
    }
  }
  async resetEmail(
    token: string,
    userFromToken: User,
    userRequestId: string,
  ): Promise<boolean> {
    if (!this.verifyUserFromToken(userRequestId, userFromToken.id)) {
      throw new UnauthorizedException();
    }
    const requests = await this.requestService.findManyByUserIdAndType(
      userFromToken.id,
      TypeRequests.RESET_EMAIL,
    );

    const isTokenMatching = requests.items[0].token === token;

    if (!isTokenMatching || requests.items[0].used === true) {
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
      throw new UnauthorizedException();
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

  async updateRole(
    role: UserRole,
    updateUserId: string,
    adminId: string,
  ): Promise<boolean> {
    await this.checkCRUDConditionForAdmin(updateUserId, adminId);

    const user = await this.findVerifiedOneWithId(updateUserId);
    if (!user) {
      throw new UnVerifiedUser('');
    }
    const result = await this.userRepository.update(updateUserId, {
      role: role,
    });

    if (!result) {
      throw new InternalServerErrorException();
    }
    return true;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneByCondition({ email });
  }

  async findOneById(id: string): Promise<User> {
    return await this.userRepository.findOneById(id);
  }

  async findVerifiedOneWithId(id: string): Promise<User> {
    return await this.userRepository.findOneByCondition({
      _id: id,
      isVerified: true,
    });
  }

  async delete(
    query: DeleteUserQueryDto,
    adminId: string,
    deleteUserId: string,
  ): Promise<boolean> {
    if (query.deleteType === DeleteType.SOFT_DELETE) {
      return await this.processSoftDelete(adminId, deleteUserId);
    }
    return await this.processHardDelete(adminId, deleteUserId);
  }

  async processSoftDelete(adminId: string, deleteUserId: string) {
    const user = await this.userRepository.findOneById(deleteUserId);
    if (!user) {
      throw new UserNotFoundException();
    }
    if (user.role === UserRole.ADMIN) {
      throw new UserConflictAdminException();
    }
    if (adminId === deleteUserId) {
      throw new UserConflictAdminException();
    }
    this.mailService.sendDeletedUserMail(user.email);
    return this.softDeleteById(deleteUserId);
  }

  async processHardDelete(adminId: string, deleteUserId: string) {
    const user = await this.findOneDeleteById(deleteUserId);
    if (!user) {
      throw new UserNotFoundException(); //
    }
    if (user.role === UserRole.ADMIN) {
      throw new UserConflictAdminException();
    }
    if (adminId === deleteUserId) {
      throw new UserConflictAdminException();
    }
    return this.hardDeleteById(deleteUserId);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(createUserDto);
    return user;
  }

  async UpdateDate(userId: string) {
    const user = await this.userRepository.findOneById(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    await this.userRepository.update(userId, { role: UserRole.BUSINESS });
  }

  async findAdmin(): Promise<User> {
    return await this.userRepository.findOneByCondition({
      role: UserRole.ADMIN,
    });
  }

  async decentralizeToBusiness(userId: string): Promise<boolean> {
    return !!(await this.userRepository.update(userId, {
      role: UserRole.BUSINESS,
    }));
  }
}
