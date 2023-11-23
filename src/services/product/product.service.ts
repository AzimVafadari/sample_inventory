import { Injectable, NotFoundException } from '@nestjs/common';
import {
  InjectRepository,
  ArangoRepository,
  ResultList,
  ArangoNewOldResult,
} from 'nest-arango';
import { ProductEntity } from '../../entities/product/product.entity';
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: ArangoRepository<ProductEntity>,
  ) {}

  async create(product: ProductEntity): Promise<ProductEntity> {
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<ResultList<ProductEntity>> {
    return await this.productRepository.findAll();
  }

  async findOne(productName: string): Promise<ProductEntity | null> {
    return await this.productRepository.findOneBy({ productName });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(
    productName: string,
    updatedproduct: Partial<ProductEntity>,
  ): Promise<ArangoNewOldResult<any>> {
    // Find the existing product
    const existingProduct = await this.productRepository.findOneBy({
      productName,
    });

    if (!existingProduct) {
      throw new NotFoundException(
        `product with productName ${productName} not found`,
      );
    }

    // Update the product fields
    Object.assign(existingProduct, updatedproduct);

    // Use the `update` method to persist changes
    const updatedDocument =
      await this.productRepository.update(existingProduct);

    // Return the updated product
    return updatedDocument ? updatedDocument : null;
  }

  async remove(productName: string): Promise<void> {
    await this.productRepository.removeBy({ productName });
  }
}
