import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { ArangoRepository, InjectRepository } from 'nest-arango';
import { MyDatabase } from 'src/database/database';
import { ProductEntity } from 'src/entities/product/product.entity';
import { ReportEntity } from 'src/entities/report/report.entity';
import { ReportService } from '../report/report.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: ArangoRepository<ProductEntity>,
    private readonly reportService: ReportService,
  ) {}
  async create(product: ProductEntity): Promise<object> {
    const cursor = await MyDatabase.getDb().query(aql`
      FOR product IN Products
      FILTER product.product_id == ${product.product_id}
      RETURN product
    `);
    const isExist = await cursor.all();
    if (isExist.length > 0) {
      return { error: 'the product already exist' };
    } else {
      if (await MyDatabase.supplierIsExist(product.supplier_id)) {
        if (await MyDatabase.categoryIsExist(product.category_id)) {
          const ReportCollectionSize = MyDatabase.getDb()
            .collection('Reports')
            .count();
          const report: ReportEntity = {
            report_id: `${(await ReportCollectionSize).count + 1}`,
            title: 'ایجاد محصول با ایدی' + product.product_id,
            description:
              'محصول با ایدی ' +
              product.product_id +
              'به مقدار ' +
              product.balance +
              'ایجاد شد',
            type: null,
            date: new Date(),
            product_id: product.product_id,
            amount: product.balance,
          };
          await this.reportService.create(report);
          await this.productRepository.save(product);
          return {
            result:
              'the product with name  ' + product.product_name + 'created',
          };
        } else {
          return { error: 'the category doesnt exist' };
        }
      } else {
        return { error: 'this supplier doesnt exist' };
      }
    }
  }
}
