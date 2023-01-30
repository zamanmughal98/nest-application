import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { productSchema } from 'src/schemas/product.schema';
import { DatabaseNames } from 'src/utils/common';
import { productController } from './product.controller';
import { productServices } from './product.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      { name: DatabaseNames.PRODUCTS, schema: productSchema },
    ]),
  ],
  controllers: [productController],
  providers: [productServices],
  exports: [productServices],
})
export class productModule {}
