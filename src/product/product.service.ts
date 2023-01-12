import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DatabaseNames } from 'src/utils/common';
import { Model, ObjectId } from 'mongoose';

@Injectable()
export class productService {
  constructor(
    @InjectModel(DatabaseNames.PRODUCTS)
    private readonly ProductModel: Model<{
      name: string;
      description: string;
      price: number;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
      _id?: ObjectId;
      __v?: number;
    }>,
  ) {}

  async getProduct() {
    console.log('get product service reached');
    const allproducts = await this.ProductModel.find({ deletedAt: '' });
    console.log({ allproducts });
    return allproducts;
  }

  getProductById(productId: string) {
    return `getProductById service returns id ${productId} `;
  }

  createProduct() {
    return 'createProduct service returns ';
  }

  updateProduct(productId: string) {
    return `updateProduct service returns id ${productId} `;
  }

  deleteProduct(productId: string) {
    return `deleteProduct service returns id ${productId} `;
  }
}
