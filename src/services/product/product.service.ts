import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { ArangoRepository, InjectRepository, ResultList } from 'nest-arango';
import { MyDatabase } from 'src/database/database';
import { ProductEntity } from 'src/entities/product/product.entity';
import { ReportEntity } from 'src/entities/report/report.entity';
import { ReportService } from '../report/report.service';
import { ProductFilter } from '../../interfaces/product/product-filter';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: ArangoRepository<ProductEntity>,
    private readonly reportService: ReportService,
  ) {}

  // the supplier id and category id properties shouldn't be got from user should handle in front of creating an object with the full property product
  async create(product: ProductEntity): Promise<object> {
    const isExist = await MyDatabase.productIsExist(product.product_id);
    if (isExist) {
      return { error: 'the product already exist' };
    } else {
      const IsSupplierExist = await MyDatabase.supplierIsExist(
        product.supplier_id,
      );
      const IsCategoryExist = await MyDatabase.categoryIsExist(
        product.category_id,
      );
      console.log(IsSupplierExist, IsCategoryExist);
      if (IsSupplierExist && IsCategoryExist) {
        const report: ReportEntity = {
          title: `ایجاد محصول با ایدی  ${product.product_id}`,
          content: [
            `محصول با ایدی ${product.product_id}  به مقدار  ${product.balance} ایچاد شد`,
          ],
          date: new Date(),
        };
        await this.reportService.create(report);
        await this.productRepository.save(product);
        return {
          result: 'the product with name  ' + product.product_name + ' created',
        };
      } else {
        if (!IsSupplierExist) {
          return { error: 'supplier doesnt exist' };
        } else {
          return { error: 'category doesnt exist' };
        }
      }
    }
  }

  async findAll(): Promise<ResultList<ProductEntity>> {
    return await this.productRepository.findAll();
  }

  async updateProduct(updatedProduct: ProductEntity): Promise<object> {
    const isProductExist = await MyDatabase.productIsExist(
      updatedProduct.product_id,
    );
    if (!isProductExist) {
      throw new Error('The product doesnt exist');
    } else {
      const isSupplierExist = await MyDatabase.supplierIsExist(
        updatedProduct.supplier_id,
      );
      if (!isSupplierExist) {
        throw new Error('The supplier doesnt exist');
      } else {
        const newAndOldProduct = await MyDatabase.getDb().query(aql`
          FOR product IN Products
          FILTER product.product_id == ${updatedProduct.product_id}
          UPDATE product._key WITH ${updatedProduct} IN Products
          RETURN {
            oldProduct : OLD,
            newProduct : NEW,
          } 
       `);
        const updateOutput = await newAndOldProduct.next();

        const difference = {
          oldPrice: updateOutput.oldProduct.price,
          newPrice: updateOutput.newProduct.price,
          oldSupplierId: updateOutput.oldProduct.supplier_id,
          newSupplierId: updateOutput.newProduct.supplier_id,
          oldBalance: updateOutput.oldProduct.balance,
          newBalance: updateOutput.newProduct.balance,
          oldImageId: updateOutput.oldProduct.image_id,
          newImageId: updateOutput.newProduct.image_id,
          oldExpiryDate: updateOutput.oldProduct.expiry_date,
          newExpiryDate: updateOutput.newProduct.expiry_date,
        };
        const content: string[] = [];
        if (difference.oldPrice !== difference.newPrice) {
          content.push(
            `قیمت محصول از  ${difference.oldPrice}  به  ${difference.newPrice}  تغییر کرد `,
          );
        }
        if (difference.oldSupplierId !== difference.newSupplierId) {
          const cursor = await MyDatabase.getDb().query(aql`
          FOR s IN Suppliers
          FILTER s._id == ${difference.oldSupplierId}
          RETURN s.supplier_name
        `);
          const oldSupplierName = await cursor.next();
          const cursor2 = await MyDatabase.getDb().query(aql`
          FOR s IN Suppliers
          FILTER s._id == ${difference.newSupplierId}
          RETURN s.supplier_name
        `);
          const NewSupplierName = await cursor2.next();
          content.push(
            `نام تامین کننده محصول از  ${oldSupplierName} به  ${NewSupplierName} تغییر کرد `,
          );
        }
        if (difference.oldBalance !== difference.newBalance) {
          content.push(
            `موجودی محصول از ${difference.oldBalance} به  ${difference.newBalance} تغییر کرد`,
          );
        }
        if (difference.oldImageId !== difference.newImageId) {
          content.push('عکس محصول تغییر کرد');
        }
        if (difference.oldExpiryDate !== difference.newExpiryDate) {
          content.push(
            `تاریخ انقضای محصول از ${difference.oldExpiryDate} به  ${difference.newExpiryDate} تغییر کرد`,
          );
        }

        const report: ReportEntity = {
          title:
            'محصول با ایدی  ' +
            updateOutput.oldProduct.product_id +
            ' تغییر کرد ',
          content: content,
          date: new Date(),
        };
        await this.reportService.create(report);
        return { result: 'the product is updated' };
      }
    }
  }

  async removeProduct(product_id: string): Promise<object> {
    const deletedProduct = await MyDatabase.getDb().query(aql`
      FOR product IN Products
      FILTER product.product_id == ${product_id}
      REMOVE product IN Products
      RETURN OLD
    `);
    const isDeleted = await deletedProduct.all();
    if (isDeleted.length > 0) {
      const report: ReportEntity = {
        title: 'delete product',
        content: [
          `the product with name ${isDeleted[0].product_name} is deleted say Good bye`,
        ],
        date: new Date(),
      };
      await this.reportService.create(report);
      return isDeleted;
    } else {
      throw new Error('The product doesnt exist');
    }
  }

  async multiFilter(filterFormat: ProductFilter) {
    const result = await MyDatabase.getDb().query(aql`
      FOR product IN Products
      FILTER ${
        filterFormat.product_name
          ? aql`product.product_name == ${filterFormat.product_name}`
          : aql`true`
      }
      FILTER ${
        filterFormat.supplier_id
          ? aql`product.supplier_id == ${filterFormat.supplier_id}`
          : aql`true`
      }
      FILTER ${
        filterFormat.balance_from
          ? aql`product.balance >= ${filterFormat.balance_from}`
          : aql`true`
      }
      FILTER ${
        filterFormat.balance_to
          ? aql`product.balance <= ${filterFormat.balance_to}`
          : aql`true`
      }
      FILTER ${
        filterFormat.scale
          ? aql`product.scale == ${filterFormat.scale}`
          : aql`true`
      }
      FILTER ${
        filterFormat.category_id
          ? aql`product.category_id == ${filterFormat.category_id}`
          : aql`true`
      }
      FILTER ${
        filterFormat.price_from
          ? aql`product.price >= ${filterFormat.price_from}`
          : aql`true`
      }
      FILTER ${
        filterFormat.price_to
          ? aql`product.price <= ${filterFormat.price_to}`
          : aql`true`
      }
      FILTER ${
        filterFormat.expiry_date_from
          ? aql`DATE_DIFF(product.expiry_date, ${filterFormat.expiry_date_from}, 'd') <= 0`
          : aql`true`
      }
      FILTER ${
        filterFormat.expiry_date_to
          ? aql`DATE_DIFF(product.expiry_date, ${filterFormat.expiry_date_to}, 'd') >= 0`
          : aql`true`
      }
      RETURN product
    `);
    const finallyResult: ProductEntity[] = await result.all();
    return finallyResult;
  }

  async findById(productId: string) {
    const productsDocument = await MyDatabase.getDb().query(aql`
      FOR p IN Products
      FILTER p.product_id == ${productId}
      RETURN p
    `);
    const product = await productsDocument.next();
    if (product) {
      return product;
    } else {
      throw new Error('Product not found');
    }
  }

  async findByProductName(productName: string) {
    const productDocuments = await MyDatabase.getDb().query(aql`
      FOR p IN Products
      FILTER LIKE(p.product_name, CONCAT(${productName}, '%'))
      RETURN p
      `);
    const products = await productDocuments.all();
    if (products.length !== 0) {
      return products;
    } else {
      throw new Error('Any product with this name doesnt found');
    }
  }

  async isExpired(productId: string) {
    const product: ProductEntity = await this.findById(productId);
    return product.expiry_date <= new Date();
  }
}
