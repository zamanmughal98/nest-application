import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseNames } from 'src/utils/common';

@Schema({
  collection: DatabaseNames.USERS,
})
export class users {
  @Prop({ type: String, required: true }) name: string;
  @Prop({ type: String, required: true }) address: string;
  @Prop({ type: String, required: true, lowercase: true, immutable: true })
  email: string;
  @Prop({ type: String, required: true }) password: string;
  @Prop({ type: String }) createdAt: string;
  @Prop({ type: String }) updatedAt: string;
  @Prop({ type: String }) deletedAt: string;
}
export const userSchema = SchemaFactory.createForClass(users);
export const USERS_MODEL = users.name;
