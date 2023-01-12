import { Module } from '@nestjs/common';
import { productModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import env from './utils/dotEnvConfig';

@Module({
  imports: [
    productModule,
    MongooseModule.forRoot(env.MONGO_DB_URL),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
