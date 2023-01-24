import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DatabaseNames } from 'src/utils/common';

@Schema({
  collection: DatabaseNames.PRODUCTS,
})
export class products {
  @Prop({ type: String, required: true }) name: string;
  @Prop({ type: String, required: true }) description: string;
  @Prop({ type: Number, required: true, min: 10 }) price: number;
  @Prop({ type: String, required: true, immutable: true }) productNo: string;
  @Prop({ type: String }) createdAt: string;
  @Prop({ type: String }) updatedAt: string;
  @Prop({ type: String }) deletedAt: string;
}
export const productSchema = SchemaFactory.createForClass(products);
export const PRODUCT_MODEL = products.name;
