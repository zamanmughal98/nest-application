import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { pageNoDto } from 'src/dto/common.dto';
import {
  paramProductIDDto,
  postProductDto,
  updateProductDto,
} from 'src/dto/product.dto';
import { JwtAuthGuard } from 'src/lib/jwt.guard';
import { productServices } from './product.service';

@Controller('/product')
export class productController {
  constructor(private readonly productService: productServices) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  getProduct(@Query() pageNo: pageNoDto) {
    const { page } = pageNo;
    return this.productService.getProduct(page);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:productId')
  getProductById(@Param() paramProductId: paramProductIDDto) {
    const { productId } = paramProductId;
    return this.productService.getProductById(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  createProduct(@Body() postProduct: postProductDto) {
    return this.productService.createProduct(postProduct);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:productId')
  updateProduct(
    @Param() paramProductId: paramProductIDDto,
    @Body() updateProduct: updateProductDto,
  ) {
    const { productId } = paramProductId;
    return this.productService.updateProduct(productId, updateProduct);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:productId')
  deleteProduct(@Param() paramProductId: paramProductIDDto) {
    const { productId } = paramProductId;
    return this.productService.deleteProduct(productId);
  }
}
