import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { productModule } from 'src/endpoints/product/product.module';
import { userModule } from 'src/endpoints/user/user.module';
import { orderSchema } from 'src/schemas/order.schema';
import { DatabaseNames } from 'src/utils/common';
import { orderController } from './order.controller';
import { orderServices } from './order.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    productModule,
    MongooseModule.forFeature([
      { name: DatabaseNames.ORDERS, schema: orderSchema },
    ]),
  ],
  controllers: [orderController],
  providers: [orderServices],
})
export class orderModule {}
