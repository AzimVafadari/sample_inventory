import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { ArangoRepository, InjectRepository, ResultList } from 'nest-arango';
import { MyDatabase } from 'src/database/database';
import { SaleOrderEntity } from '../../../entities/order/sale/sale-order.entity';
import { ProductEntity } from '../../../entities/product/product.entity';
import { ReportEntity } from '../../../entities/report/report.entity';
import { CustomerEntity } from '../../../entities/customer/customer.entity';
import { ReportService } from '../../report/report.service';
import { ProductService } from '../../product/product.service';
import { SaleOrderFilter } from '../../../interfaces/order/sale/sale-order-filter';

@Injectable()
export class SaleOrderService {
  constructor(
    @InjectRepository(SaleOrderEntity)
    private readonly saleOrderRepository: ArangoRepository<SaleOrderEntity>,
    private readonly reportService: ReportService,
    private readonly productService: ProductService,
  ) {}

  //This method create a sale order if it doesn't exist
  async create(saleOrder: SaleOrderEntity): Promise<object> {
    const temp: ProductEntity = await this.productService.findById(
      saleOrder.product_id,
    );
    const saleOrderProduct = temp[0];
    if (await MyDatabase.productIsExist(saleOrder.product_id)) {
      //Find customer
      const customer = await MyDatabase.getDb().query(aql`
          FOR c IN Customers
          FILTER c._id == ${saleOrder.customer_id}
          RETURN c
          `);
      const c: CustomerEntity = await customer.next();
      if (c === undefined) return { result: 'customer does not exist' };
      if (saleOrder.scale !== saleOrderProduct.scale) {
        return {
          result:
            'the scale of the product is not the same as the scale of the sale order',
        };
      } else {
        if (saleOrder.amount > saleOrderProduct.balance) {
          return { result: 'the amount of the product is not enough' };
        } else {
          if (await this.productService.isExpired(saleOrder.product_id)) {
            return { error: 'product is expired' };
          } else {
            const report: ReportEntity = {
              title: 'سفارش فروش به ' + c.name,
              content: ['این سفارش مربوط به فروش است'],
              date: new Date(),
            };
            //Create report
            await this.reportService.create(report);
            await this.saleOrderRepository.save(saleOrder);
            return { result: 'the saleOrder is created' };
          }
        }
      }
    } else {
      return { result: 'Please first create the product' };
    }
  }

  //Multi-filter based on an interface
  async multiFilter(filterFormat: SaleOrderFilter) {
    // This AQL query is written by chatGPT
    const result = await MyDatabase.getDb().query(aql`
      FOR so IN SaleOrders
      FILTER ${
        filterFormat.product_id
          ? aql`so.product_id == ${filterFormat.product_id}`
          : aql`true`
      }
      FILTER ${
        filterFormat.customer_id
          ? aql`so.customer_id == ${filterFormat.customer_id}`
          : aql`true`
      }
      FILTER ${
        filterFormat.amount_from
          ? aql`so.amount >= ${filterFormat.amount_from}`
          : aql`true`
      }
      FILTER ${
        filterFormat.amount_to
          ? aql`so.amount <= ${filterFormat.amount_to}`
          : aql`true`
      }
      FILTER ${
        filterFormat.status
          ? aql`so.status == ${filterFormat.status}`
          : aql`true`
      }
      FILTER ${
        filterFormat.date_from
          ? aql`DATE_DIFF(so.create_date, ${filterFormat.date_from}, 'd') <= 0`
          : aql`true`
      }
      FILTER ${
        filterFormat.date_to
          ? aql`DATE_DIFF(so.create_date, ${filterFormat.date_to}, 'd') >= 0`
          : aql`true`
      }
      RETURN so
    `);
    const finallyResult: SaleOrderEntity[] = await result.all();
    return finallyResult;
  }

  //This method return all buy orders
  async findAll(): Promise<ResultList<SaleOrderEntity>> {
    return await this.saleOrderRepository.findAll();
  }

  //This method update a buy order if it does exist
  async update(
    _id: string,
    updatedSaleOrder: SaleOrderEntity,
  ): Promise<object> {
    //This query is better that be updated later...
    const updatedDocument = await MyDatabase.getDb().query(aql`
        FOR so IN SaleOrders 
        FILTER so._id == ${_id}
        UPDATE so WITH ${updatedSaleOrder} IN SaleOrders
        RETURN OLD
    `);
    const isUpdated: SaleOrderEntity = await updatedDocument.next();
    if (
      isUpdated.status != 'finished' &&
      updatedSaleOrder.status == 'finished'
    ) {
      //Update product by new balance
      const temp = await this.productService.findById(
        updatedSaleOrder.product_id,
      );
      const product: ProductEntity = temp[0];
      console.log(product);
      product.balance = product.balance - updatedSaleOrder.amount;
      await this.productService.updateProduct(product);
      if (isUpdated) {
        return { message: 'The saleOrder is successfully updated.' };
      } else {
        return { error: 'saleOrder not found' };
      }
    }
  }

  //This method remove a buy order if it does exist
  async remove(saleOrderId: string): Promise<object> {
    //This query is better that be updated later...
    const deletedDocument = await MyDatabase.getDb().query(aql`
    FOR so IN SaleOrders
    FILTER so._id == ${saleOrderId}
    REMOVE so IN SaleOrders
    RETURN OLD
    `);
    const isDeleted = await deletedDocument.all();
    if (isDeleted.length > 0) {
      return { result: 'saleOrder successfully deleted' };
    } else {
      return { result: 'saleOrder not found' };
    }
  }

  async findOneByKey(saleOrderkey: string): Promise<object> {
    const saleOrderDocument = await MyDatabase.getDb().query(aql`
      FOR so IN SaleOrders
      FILTER so._key == ${saleOrderkey}
      RETURN so
    `);
    const saleOrder = await saleOrderDocument.next();
    if (saleOrder) {
      return saleOrder;
    } else {
      return { error: 'SaleOrder not found' };
    }
  }
}
