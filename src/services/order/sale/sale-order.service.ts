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
    if (await MyDatabase.productIsExist(saleOrder.product_id)) {
      //Update product by new balance
      const product = await MyDatabase.getDb().query(aql`
        FOR product in Products
        FILTER product.product_id == ${saleOrder.product_id}
        RETURN product
        `);
      const p: ProductEntity = await product.next();
      if (parseInt(p.balance) >= parseInt(saleOrder.amount)) {
        const newBalance = parseInt(p.balance) - parseInt(saleOrder.amount);
        const scale: string[] = p.balance.split(' ');
        p.balance = `${newBalance} ${scale[1]}`;
        await this.productService.updateProduct(p);

        //Find customer
        const customer = await MyDatabase.getDb().query(aql`
          FOR c IN Customers
          FILTER c._id == ${saleOrder.customer_id}
          RETURN c
          `);
        const c: CustomerEntity = await customer.next();
        if (c === undefined) return { result: 'customer does not exist' };
        const report: ReportEntity = {
          title: 'سفارش فروش به ' + c.name,
          content: ['این سفارش مربوط به فروش است'],
          date: new Date(),
        };
        //Create report
        await this.reportService.create(report);
        await this.saleOrderRepository.save(saleOrder);
        return { result: 'the saleOrder is created' };
      } else {
        return { result: 'Balance of this product is not enough' };
      }
    } else {
      return { result: 'Please first create the product' };
    }
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
    const isUpdated = await updatedDocument.next();
    if (isUpdated) {
      return { message: 'The saleOrder is successfully updated.' };
    } else {
      return { error: 'saleOrder not found' };
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
  //This method filter buy orders that have specific status
  async findManyByStatus(status: string): Promise<object> {
    //This query search all saleOrders that their name starts with saleOrderName
    //ChatGPT did this query
    const saleOrder = await MyDatabase.getDb().query(aql`
    FOR saleOrder IN SaleOrders
    FILTER LIKE(saleOrder.status, CONCAT(${status}, '%'))
    RETURN saleOrder
    `);
    const isExist = saleOrder.all();
    if ((await isExist).length > 0) {
      return isExist;
    } else {
      return { error: 'saleOrder not found' };
    }
  }
  //This method filter buy orders based on their product id
  async findManyByProductId(productId: string): Promise<object> {
    //This query search all saleOrders that their name starts with saleOrderName
    //ChatGPT did this query
    const saleOrder = await MyDatabase.getDb().query(aql`
    FOR saleOrder IN SaleOrders
    FILTER LIKE(saleOrder.product_id, CONCAT(${productId}, '%'))
    RETURN saleOrder
    `);
    const isExist = saleOrder.all();
    if ((await isExist).length > 0) {
      return isExist;
    } else {
      return { error: 'saleOrder not found' };
    }
  }
  //This method filter buy orders based on their customer id
  async findManyByCustomerId(customerId: string): Promise<object> {
    //This query search all saleOrders that their name starts with saleOrderName
    //ChatGPT did this query
    const saleOrder = await MyDatabase.getDb().query(aql`
    FOR saleOrder IN SaleOrders
    FILTER LIKE(saleOrder.customer_id, CONCAT(${customerId}, '%'))
    RETURN saleOrder
    `);
    const isExist = saleOrder.all();
    if ((await isExist).length > 0) {
      return isExist;
    } else {
      return { error: 'saleOrder not found' };
    }
  }
}
