import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';
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
  @Exclude()
  password: string;

  @Prop({ required: true, minlength: 2, maxlength: 50 })
  firstName: string;

  @Prop({ required: true, minlength: 2, maxlength: 50 })
  lastName: string;

  @Prop([String])
  @Exclude()
  roles: string[]; //Partial index

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
  @Exclude()
  businesses: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
//path: packages/backend/src/modules/user/dto/create-user.dto.ts
