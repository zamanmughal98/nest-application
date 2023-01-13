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
import { isNumber, isString } from 'lodash';
import { SendResponse } from 'src/utils/common';
import * as validator from 'validator';
import { productService } from './product.service';

@Controller('/product')
export class productController {
  constructor(private readonly productService: productService) {}

  @Get()
  getProduct(@Query('page') page: string) {
    return this.productService.getProduct(page);
  }

  @Get(':productId')
  getProductById(@Param('productId') productId: string) {
    if (validator.isEmpty(productId) || !isString(productId))
      return SendResponse.INVALID_PRODUCT_ID;

    return this.productService.getProductById(productId);
  }

  @Post()
  createProduct(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('productNo') productNo: string,
    @Body('price') price: string,
  ) {
    if (validator.isEmpty(name) || !isString(name))
      return SendResponse.INVALID_PRODUCT_NAME;

    if (validator.isEmpty(description) || !isString(description))
      return SendResponse.INVALID_PRODUCT_DESCRIPTION;

    if (validator.isEmpty(productNo) || !isString(productNo))
      return SendResponse.INVALID_PRODUCT_NO;

    if (!isNumber(price) || price < 10) return SendResponse.MIN_PRICE_ERROR;

    return this.productService.createProduct({
      name,
      description,
      productNo,
      price,
    });
  }

  @Put(':productId')
  updateProduct(
    @Param('productId') productId: string,

    @Body('name') name: string,
    @Body('description') description: string,
    @Body('price') price: string,
  ) {
    if (validator.isEmpty(productId) || !isString(productId))
      return SendResponse.INVALID_PRODUCT_ID;

    if (validator.isEmpty(name) || !isString(name))
      return SendResponse.INVALID_PRODUCT_NAME;

    if (validator.isEmpty(description) || !isString(description))
      return SendResponse.INVALID_PRODUCT_DESCRIPTION;

    if (!isNumber(price) || price < 10) return SendResponse.MIN_PRICE_ERROR;

    return this.productService.updateProduct(productId, {
      name,
      description,
      price,
    });
  }

  @Delete(':productId')
  deleteProduct(@Param('productId') productId: string) {
    if (validator.isEmpty(productId) || !isString(productId))
      return SendResponse.INVALID_PRODUCT_ID;

    return this.productService.deleteProduct(productId);
  }
}
