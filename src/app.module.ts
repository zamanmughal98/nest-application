import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { authModule } from './auth/auth.module';
import { orderModule } from './order/order.module';
import { productModule } from './product/product.module';
import { userModule } from './user/user.module';
import env from './utils/dotEnvConfig';

@Module({
  imports: [
    MongooseModule.forRoot(env.MONGO_DB_URL),
    orderModule,
    productModule,
    authModule,
    userModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
