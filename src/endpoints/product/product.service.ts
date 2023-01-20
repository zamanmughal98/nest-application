import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { postProductDto, updateProductDto } from 'src/dto/product.dto';
import { createTimeStamp, DatabaseNames, SendResponse } from 'src/utils/common';

@Injectable()
export class productServices {
  constructor(
    @InjectModel(DatabaseNames.PRODUCTS)
    private readonly ProductModel: Model<IProduct>,
  ) {}

  async getProduct(page: string) {
    try {
      // Pagination
      const recordPerPage = 2;
      const pageNo: number = parseInt(page, 10) || 1;
      const skipRecords: number = recordPerPage * (pageNo - 1);
      const maxPages: number = Math.ceil(
        (await this.ProductModel.countDocuments({ deletedAt: '' })) /
          recordPerPage,
      );

      if (pageNo <= maxPages) {
        const allproducts: IProduct[] = await this.ProductModel.find({
          deletedAt: '',
        });

        const paginationRecords: IProduct[] = allproducts.slice(
          skipRecords,
          skipRecords + recordPerPage,
        );

        if (allproducts && paginationRecords)
          return { Pagination: paginationRecords, Products: allproducts };
        else return { message: SendResponse.PRODUCT_NOT_FOUND };
      } else return { message: SendResponse.PAGE_LIMIT_ERROR };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductById(productId: string) {
    try {
      const productExists: IProduct = await this.ProductModel.findById({
        _id: new ObjectId(productId),
      });

      if (productExists && productExists.deletedAt === '') {
        return productExists;
      } else return { message: SendResponse.PRODUCT_NOT_FOUND };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createProduct(postProduct: postProductDto) {
    try {
      const { name, description, price, productNo } = postProduct;

      const productExists: IProduct = await this.ProductModel.findOne({
        $or: [{ name }, { productNo }],
      });

      if (!productExists) {
        const dataToWrite = {
          name,
          description,
          price,
          productNo,
          createdAt: createTimeStamp(),
          updatedAt: '',
          deletedAt: '',
        };

        const newProduct: IProductSchema = await this.ProductModel.create(
          dataToWrite,
        );
        return newProduct;
      } else return { message: SendResponse.PRODUCT_ALREADY_EXIST };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(productId: string, updateProduct: updateProductDto) {
    try {
      const productExists: IProduct = await this.ProductModel.findById(
        productId,
      );

      if (productExists && productExists.deletedAt === '') {
        const { name, description, price } = updateProduct;

        productExists.name = name;
        productExists.description = description;
        productExists.price = price;
        productExists.updatedAt = createTimeStamp();

        await this.ProductModel.updateOne(
          { _id: new ObjectId(productId) },
          { $set: productExists },
        );

        return await this.ProductModel.findById(productId);
      } else return { message: SendResponse.PRODUCT_NOT_FOUND };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProduct(productId: string) {
    try {
      const productExists: IProduct = await this.ProductModel.findById(
        productId,
      );

      if (productExists && productExists.deletedAt === '') {
        productExists.deletedAt = createTimeStamp();

        await this.ProductModel.updateOne(
          { _id: new ObjectId(productId) },
          { $set: productExists },
        );

        return { message: SendResponse.PRODUCT_DELETED };
      } else return { message: SendResponse.PRODUCT_NOT_FOUND };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
