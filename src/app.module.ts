import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { authModule } from './endpoints/auth/auth.module';
import { orderModule } from './endpoints/order/order.module';
import { productModule } from './endpoints/product/product.module';
import { userModule } from './endpoints/user/user.module';

@Module({
  imports: [
    orderModule,
    productModule,
    authModule,
    userModule,
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    ConfigModule.forRoot(),
  ],
})
export class AppModule {}
