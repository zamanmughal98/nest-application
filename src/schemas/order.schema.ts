import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { DatabaseNames, OrderStatus } from 'src/utils/common';
import { products, PRODUCT_MODEL } from './product.schema';
import { users, USERS_MODEL } from './user.schema';


@Schema()
class userMapping {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: USERS_MODEL,
  })
  userId: Types.ObjectId | string | users;
}
const usertMappingSchema = SchemaFactory.createForClass(userMapping);

@Schema()
class productMapping {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: PRODUCT_MODEL,
  })
  productId: Types.ObjectId | string | products;

  @Prop({
    type: String,
    required: true,
    ref: PRODUCT_MODEL,
  })
  name: string;

  @Prop({
    type: Number,
    required: true,
    min: 10,
    ref: PRODUCT_MODEL,
  })
  price: number;

  @Prop({ type: Number, required: true, min: 1, max: 20 }) quantity: number;

  @Prop({ type: Number, required: true, min: 10 }) totalPrice: number;
}
const productMappingSchema = SchemaFactory.createForClass(productMapping);

@Schema({
  collection: DatabaseNames.ORDERS,
})
export class orders {
  @Prop({ type: usertMappingSchema, required: true }) User: userMapping;

  @Prop({ type: [productMappingSchema], required: true })
  Products: productMapping;

  @Prop({ type: Number, required: true, immutable: true, min: 10 })
  grandTotal: number;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Prop({ type: String }) createdAt: string;
  @Prop({ type: String }) updatedAt: string;
  @Prop({ type: String }) deletedAt: string;
}

export const orderSchema = SchemaFactory.createForClass(orders);
