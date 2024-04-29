import { string } from '@hapi/joi';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Address } from 'cluster';
import {
  model,
  Document,
  HydratedDocument,
  Types,
  VirtualType,
} from 'mongoose';
import { UserRole } from 'src/common/enums/user.enum';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

export type UserDocument = HydratedDocument<User>;

export const AddressUser = {
  city: String,
  province: String,
  country: String,
};

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User extends BaseEntity {
  @Prop({ required: true, unique: true, trim: true, maxlength: 100 })
  email: string;

  @Prop({ required: true, minlength: 8 })
  password: string;

  @Prop({ required: true, minlength: 2, maxlength: 50 })
  firstName: string;

  @Prop({ required: true, minlength: 2, maxlength: 50 })
  lastName: string;

  @Prop([String])
  roles: string[];

  @Prop()
  image: string;

  @Prop()
  phoneNumber: string;

  @Prop({
    type: AddressUser,
    _id: false,
    required: true,
  })
  address: Object;

  @Prop([Types.ObjectId])
  businesses: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
//path: packages/backend/src/modules/user/dto/create-user.dto.ts
