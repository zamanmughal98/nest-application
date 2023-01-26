import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const products: IProduct[] = await this.productModel.find({
      _id: productIdArray,
      deletedAt: '',
    });
    if (products.length !== 0) return products;
    throw new NotFoundException(SendResponse.PRODUCT_NOT_FOUND);
  }

  async getProduct(page: string): Promise<IProductPaginationData> {
    const recordPerPage = 2;
    const pageNo: number = parseInt(page, 10) || 1;
    const skipRecords: number = recordPerPage * (pageNo - 1);

    const maxPages: number = Math.ceil(
      (await this.productModel.countDocuments({ deletedAt: '' })) /
        recordPerPage,
    );

    if (maxPages === 0)
      throw new NotFoundException(SendResponse.PRODUCT_NOT_FOUND);

    if (pageNo <= maxPages) {
      const paginationRecords: IProduct[] = await this.productModel
        .find({ deletedAt: '' })
        .skip(skipRecords)
        .limit(recordPerPage);

      return { data: paginationRecords };
    } else throw new BadRequestException(SendResponse.PAGE_LIMIT_ERROR);
  }

  async getProductById(productId: string): Promise<IPostProductData> {
    const product: IProduct = await this.productModel.findById({
      _id: new ObjectId(productId),
    });

    if (product && product.deletedAt === '') {
      return { data: product };
    } else throw new NotFoundException(SendResponse.PRODUCT_NOT_FOUND);
  }

  async createProduct(postProduct: postProductDto): Promise<IPostProductData> {
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
    } else throw new ConflictException(SendResponse.PRODUCT_ALREADY_EXIST);
  }

  async updateProduct(
    productId: string,
    updateProduct: updateProductDto,
  ): Promise<IPostProductData> {
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
    } else throw new NotFoundException(SendResponse.PRODUCT_NOT_FOUND);
  }

  async deleteProduct(productId: string): Promise<IMessage> {
    const product: IProduct = await this.productModel.findById(productId);

    if (product && product.deletedAt === '') {
      product.deletedAt = createTimeStamp();

      await this.productModel.updateOne(
        { _id: new ObjectId(productId) },
        { $set: product },
      );

      return { message: SendResponse.PRODUCT_DELETED };
    } else throw new NotFoundException(SendResponse.PRODUCT_NOT_FOUND);
  }
}
