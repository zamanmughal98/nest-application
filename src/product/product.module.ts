import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { productSchema } from 'src/mongoDb/schema';
import { DatabaseNames } from 'src/utils/common';
import { productController } from './product.controller';
import { productServices } from './product.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DatabaseNames.PRODUCTS, schema: productSchema },
    ]),
  ],
  controllers: [productController],
  providers: [productServices],
  exports: [productServices],
})
export class productModule {}
