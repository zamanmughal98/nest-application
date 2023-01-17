import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { orderSchema } from 'src/mongoDb/schema';
import { DatabaseNames } from 'src/utils/common';
import { orderController } from './order.controller';
import { orderServices } from './order.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DatabaseNames.ORDERS, schema: orderSchema },
    ]),
  ],
  controllers: [orderController],
  providers: [orderServices],
})
export class orderModule {}
