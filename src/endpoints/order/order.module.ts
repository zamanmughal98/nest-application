import { Module } from '@nestjs/common';
import { productModule } from 'src/endpoints/product/product.module';
import { orderController } from './order.controller';
import { orderServices } from './order.service';

@Module({
  imports: [productModule],
  controllers: [orderController],
  providers: [orderServices],
})
export class orderModule {}
