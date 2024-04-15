import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { model, Document, HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/cores/entity/base/entity.base';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User extends BaseEntity {
  @Prop()
  user_nickname: string;

  @Prop()
  user_email: string;

  @Prop()
  user_password: string;

  @Prop()
  user_profilePhotoURL: string;

  @Prop()
  user_website: string;

  @Prop()
  user_bio: string;

  @Prop()
  user_favorite_posts: string[];

  @Prop()
  user_following_count: number;

  @Prop()
  user_follower_count: number;

  @Prop()
  user_gender: string;

  @Prop()
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
