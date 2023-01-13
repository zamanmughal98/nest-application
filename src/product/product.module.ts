import { Module } from '@nestjs/common';
import { productController } from './product.controller';
import { productService } from './product.service';
import { MongooseModule } from '@nestjs/mongoose';
import { productSchema } from 'src/mongoDb/schema';
import { DatabaseNames } from 'src/utils/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DatabaseNames.PRODUCTS, schema: productSchema },
    ]),
  ],
  controllers: [productController],
  providers: [productService],
})
export class productModule {}
