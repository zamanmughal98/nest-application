import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { orderSchema } from 'src/lib/mongoDBSchema';
import { productModule } from 'src/product/product.module';
import { userModule } from 'src/user/user.module';
import { DatabaseNames } from 'src/utils/common';
import { orderController } from './order.controller';
import { orderServices } from './order.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    userModule,
    productModule,
    MongooseModule.forFeature([
      { name: DatabaseNames.ORDERS, schema: orderSchema },
    ]),
  ],
  controllers: [orderController],
  providers: [orderServices],
})
export class orderModule {}
