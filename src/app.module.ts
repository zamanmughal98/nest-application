import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { authModule } from './auth/auth.module';
import { orderModule } from './order/order.module';
import { productModule } from './product/product.module';
import { userModule } from './user/user.module';

@Module({
  imports: [
    productModule,
    orderModule,
    authModule,
    userModule,
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
