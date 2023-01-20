import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { isNumber, isString } from 'lodash';
import { JwtAuthGuard } from 'src/lib/jwt.guard';
import { SendResponse } from 'src/utils/common';
import * as validator from 'validator';
import { productServices } from './product.service';

@Controller('/product')
export class productController {
  constructor(private readonly productService: productServices) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getProduct(@Query('page') page: string) {
    return this.productService.getProduct(page);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:productId')
  getProductById(@Param('productId') productId: string) {
    if (validator.isEmpty(productId) || !isString(productId))
      throw new HttpException(
        SendResponse.INVALID_PRODUCT_ID,
        HttpStatus.FORBIDDEN,
      );

    return this.productService.getProductById(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  createProduct(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('productNo') productNo: string,
    @Body('price') price: string,
  ) {
    if (validator.isEmpty(name) || !isString(name))
      throw new HttpException(
        SendResponse.INVALID_PRODUCT_NAME,
        HttpStatus.FORBIDDEN,
      );

    if (validator.isEmpty(description) || !isString(description))
      throw new HttpException(
        SendResponse.INVALID_PRODUCT_DESCRIPTION,
        HttpStatus.FORBIDDEN,
      );

    if (validator.isEmpty(productNo) || !isString(productNo))
      throw new HttpException(
        SendResponse.INVALID_PRODUCT_NO,
        HttpStatus.FORBIDDEN,
      );

    if (!isNumber(price) || price < 10)
      throw new HttpException(
        SendResponse.MIN_PRICE_ERROR,
        HttpStatus.FORBIDDEN,
      );

    return this.productService.createProduct({
      name,
      description,
      productNo,
      price,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:productId')
  updateProduct(
    @Param('productId') productId: string,

    @Body('name') name: string,
    @Body('description') description: string,
    @Body('price') price: string,
  ) {
    if (validator.isEmpty(productId) || !isString(productId))
      throw new HttpException(
        SendResponse.INVALID_PRODUCT_ID,
        HttpStatus.FORBIDDEN,
      );

    if (validator.isEmpty(name) || !isString(name))
      throw new HttpException(
        SendResponse.INVALID_PRODUCT_NAME,
        HttpStatus.FORBIDDEN,
      );

    if (validator.isEmpty(description) || !isString(description))
      throw new HttpException(
        SendResponse.INVALID_PRODUCT_DESCRIPTION,
        HttpStatus.FORBIDDEN,
      );

    if (!isNumber(price) || price < 10)
      throw new HttpException(
        SendResponse.MIN_PRICE_ERROR,
        HttpStatus.FORBIDDEN,
      );

    return this.productService.updateProduct(productId, {
      name,
      description,
      price,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:productId')
  deleteProduct(@Param('productId') productId: string) {
    if (validator.isEmpty(productId) || !isString(productId))
      throw new HttpException(
        SendResponse.INVALID_PRODUCT_ID,
        HttpStatus.FORBIDDEN,
      );

    return this.productService.deleteProduct(productId);
  }
}
