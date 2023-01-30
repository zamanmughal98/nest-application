import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { pageNoDto } from 'src/dto/common.dto';
import {
  productIdDto,
  postProductDto,
  updateProductDto,
} from 'src/dto/product.dto';
import { productServices } from './product.service';

@Controller('/product')
export class productController {
  constructor(private readonly productServices: productServices) {}

  @Get('/')
  getProduct(@Query() pageNo: pageNoDto) {
    const { page } = pageNo;

    return this.productServices.getProduct(page);
  }

  @Get('/:productId')
  getProductById(@Param() paramProductId: productIdDto) {
    const { productId } = paramProductId;

    return this.productServices.getProductById(productId);
  }

  @Post('/')
  createProduct(@Body() postProduct: postProductDto) {
    return this.productServices.createProduct(postProduct);
  }

  @Put('/:productId')
  updateProduct(
    @Param() paramProductId: productIdDto,
    @Body() updateProduct: updateProductDto,
  ) {
    const { productId } = paramProductId;

    return this.productServices.updateProduct(productId, updateProduct);
  }

  @Delete('/:productId')
  deleteProduct(@Param() paramProductId: productIdDto) {
    const { productId } = paramProductId;

    return this.productServices.deleteProduct(productId);
  }
}
