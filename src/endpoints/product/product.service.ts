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
    private readonly productModel: Model<IProduct>,
  ) {}

  async getManyProducts(productIdArray: string[]): Promise<IProduct[]> {
    try {
      const products: IProduct[] = await this.productModel.find({
        _id: productIdArray,
        deletedAt: '',
      });

      return products;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProduct(page: string): Promise<IProductPaginationData> {
    try {
      // Pagination
      const recordPerPage = 2;
      const pageNo: number = parseInt(page, 10) || 1;
      const skipRecords: number = recordPerPage * (pageNo - 1);
      const maxPages: number = Math.ceil(
        (await this.productModel.countDocuments({ deletedAt: '' })) /
          recordPerPage,
      );

      if (pageNo <= maxPages) {
        const products: IProduct[] = await this.productModel.find({
          deletedAt: '',
        });

        const paginationRecords: IProduct[] = products.slice(
          skipRecords,
          skipRecords + recordPerPage,
        );

        if (paginationRecords) return { data: paginationRecords };
        else return { message: SendResponse.PRODUCT_NOT_FOUND };
      } else return { message: SendResponse.PAGE_LIMIT_ERROR };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductById(productId: string): Promise<IPostProductData> {
    try {
      const product: IProduct = await this.productModel.findById({
        _id: new ObjectId(productId),
      });

      if (product && product.deletedAt === '') {
        return { data: product };
      } else return { message: SendResponse.PRODUCT_NOT_FOUND };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createProduct(postProduct: postProductDto): Promise<IPostProductData> {
    try {
      const { name, description, price, productNo } = postProduct;

      const product: IProduct = await this.productModel.findOne({
        $or: [{ name }, { productNo }],
      });

      if (!product) {
        const dataToWrite = {
          name,
          description,
          price,
          productNo,
          createdAt: createTimeStamp(),
          updatedAt: '',
          deletedAt: '',
        };

        const newProduct: IProductSchema = await this.productModel.create(
          dataToWrite,
        );
        return { data: newProduct };
      } else return { message: SendResponse.PRODUCT_ALREADY_EXIST };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(
    productId: string,
    updateProduct: updateProductDto,
  ): Promise<IPostProductData> {
    try {
      const product: IProduct = await this.productModel.findById(productId);

      if (product && product.deletedAt === '') {
        const { name, description, price } = updateProduct;

        product.name = name;
        product.description = description;
        product.price = price;
        product.updatedAt = createTimeStamp();

        await this.productModel.updateOne(
          { _id: new ObjectId(productId) },
          { $set: product },
        );

        return { data: await this.productModel.findById(productId) };
      } else return { message: SendResponse.PRODUCT_NOT_FOUND };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteProduct(productId: string): Promise<IMessage> {
    try {
      const product: IProduct = await this.productModel.findById(productId);

      if (product && product.deletedAt === '') {
        product.deletedAt = createTimeStamp();

        await this.productModel.updateOne(
          { _id: new ObjectId(productId) },
          { $set: product },
        );

        return { message: SendResponse.PRODUCT_DELETED };
      } else return { message: SendResponse.PRODUCT_NOT_FOUND };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
