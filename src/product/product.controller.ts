import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { productService } from './product.service';

@Controller('/product')
export class productController {
  constructor(private readonly productService: productService) {}

  @Get()
 async getProduct() {
    console.log('get product controller reached');
    return this.productService.getProduct();
  }
  @Get(':productId')
  getProductById(@Param('productId') productId: string) {
    return this.productService.getProductById(productId);
  }
  @Post()
  createProduct() {
    return this.productService.createProduct();
  }

  @Put(':productId')
  updateProduct(@Param('productId') productId: string) {
    return this.productService.updateProduct(productId);
  }

  @Delete(':productId')
  deleteProduct(@Param('productId') productId: string) {
    return this.productService.deleteProduct(productId);
  }
}
