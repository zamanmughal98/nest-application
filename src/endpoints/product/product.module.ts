import { Module } from '@nestjs/common';
import { productController } from './product.controller';
import { productServices } from './product.service';

@Module({
  imports: [],
  controllers: [productController],
  providers: [productServices],
  exports: [productServices],
})
export class productModule {}
