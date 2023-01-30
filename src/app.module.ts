import { Module } from '@nestjs/common';
import { authModule } from './endpoints/auth/auth.module';
import { orderModule } from './endpoints/order/order.module';
import { productModule } from './endpoints/product/product.module';
import { userModule } from './endpoints/user/user.module';

@Module({
  imports: [orderModule, productModule, authModule, userModule],
})
export class AppModule {}
