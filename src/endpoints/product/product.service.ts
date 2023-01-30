import { Injectable } from '@nestjs/common';
import { postProductDto, updateProductDto } from 'src/dto/product.dto';

@Injectable()
export class productServices {
  constructor() {}

  async getManyProducts(productIdArray: string[]) {
    return { productIdArray };
  }

  async getProduct(page: string) {
    const recordPerPage = 2;
    const pageNo: number = parseInt(page, 10) || 1;
    const skipRecords: number = recordPerPage * (pageNo - 1);

    return { pageNo, skipRecords };
  }

  async getProductById(productId: string) {
    return { productId };
  }

  async createProduct(postProduct: postProductDto) {
    return { postProduct };
  }

  async updateProduct(productId: string, updateProduct: updateProductDto) {
    return { productId, updateProduct };
  }

  async deleteProduct(productId: string) {
    return { productId };
  }
}
