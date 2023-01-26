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
  productIdDto,
  postProductDto,
  updateProductDto,
} from 'src/dto/product.dto';
import { jwtAuthGuard } from 'src/endpoints/auth/guards/jwt.guard';
import { userValidationGuard } from '../auth/guards/user-validation.guard';
import { productServices } from './product.service';

@Controller('/product')
export class productController {
  constructor(private readonly productServices: productServices) {}

  @UseGuards(userValidationGuard)
  @UseGuards(jwtAuthGuard)
  @Get('/')
  getProduct(@Query() pageNo: pageNoDto): Promise<IProductPaginationData> {
    const { page } = pageNo;

    return this.productServices.getProduct(page);
  }

  @UseGuards(userValidationGuard)
  @UseGuards(jwtAuthGuard)
  @Get('/:productId')
  getProductById(
    @Param() paramProductId: productIdDto,
  ): Promise<IPostProductData> {
    const { productId } = paramProductId;

    return this.productServices.getProductById(productId);
  }

  @UseGuards(userValidationGuard)
  @UseGuards(jwtAuthGuard)
  @Post('/')
  createProduct(
    @Body() postProduct: postProductDto,
  ): Promise<IPostProductData> {
    return this.productServices.createProduct(postProduct);
  }

  @UseGuards(userValidationGuard)
  @UseGuards(jwtAuthGuard)
  @Put('/:productId')
  updateProduct(
    @Param() paramProductId: productIdDto,
    @Body() updateProduct: updateProductDto,
  ): Promise<IPostProductData> {
    const { productId } = paramProductId;

    return this.productServices.updateProduct(productId, updateProduct);
  }

  @UseGuards(userValidationGuard)
  @UseGuards(jwtAuthGuard)
  @Delete('/:productId')
  deleteProduct(@Param() paramProductId: productIdDto): Promise<IMessage> {
    const { productId } = paramProductId;

    return this.productServices.deleteProduct(productId);
  }
}
