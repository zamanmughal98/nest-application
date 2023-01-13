import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { productModule } from './product/product.module';
import { userModule } from './user/user.module';
import env from './utils/dotEnvConfig';

@Module({
  imports: [
    productModule,
    userModule,
    MongooseModule.forRoot(env.MONGO_DB_URL),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
