import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { ArangoRepository, InjectRepository, ResultList } from 'nest-arango';
import { MyDatabase } from 'src/database/database';
import { BuyOrderEntity } from '../../../entities/order/buy/buy-order.entity';
import { ProductEntity } from '../../../entities/product/product.entity';
import { ReportEntity } from '../../../entities/report/report.entity';
import { SupplierEntity } from '../../../entities/supplier/supplier.entity';
import { ReportService } from '../../report/report.service';

@Injectable()
export class BuyOrderService {
  constructor(
    @InjectRepository(BuyOrderEntity)
    private readonly buyOrderRepository: ArangoRepository<BuyOrderEntity>,
    private readonly reportService: ReportService,
  ) {}
  //This method create a buy order if it doesn't exist
  async create(buyOrder: BuyOrderEntity): Promise<object> {
    const cursor = await MyDatabase.getDb().query(aql`
    FOR bo IN BuyOrders
    FILTER bo.buy_order_id == ${buyOrder.buy_order_id}
    RETURN bo
  `);
    const isExist = cursor.all();
    if ((await isExist).length > 0) {
      return { error: 'buyOrder already exist' };
    } else {
      if (await MyDatabase.productIsExist(buyOrder.product_id)) {
        //Update product by new balance
        const product = await MyDatabase.getDb().query(aql`
        FOR product in Products
        FILTER product.product_id == ${buyOrder.product_id}
        RETURN product
        `);
        const p: ProductEntity = await product.next();
        const scale: string[] = p.balance.split(' ');
        const newBalance = parseInt(p.balance) + parseInt(buyOrder.amount);
        p.balance = `${newBalance} ${scale[1]}`;
        await MyDatabase.getDb().query(aql`
        FOR p IN Products 
        FILTER p.product_id == ${p.product_id}
        UPDATE p._key WITH ${p} IN Products
       `);
      } else {
        return { result: 'Please first create the product' };
      }
      const sizeOfReportCollection =
        MyDatabase.getDb().collection('Reports').properties.length;
      //Find customer
      const supplier = await MyDatabase.getDb().query(aql`
          FOR s IN Suppliers
          FILTER s.supplier_id == ${buyOrder.supplier_id}
          RETURN s
          `);
      const s: SupplierEntity = await supplier.next();
      const report: ReportEntity = {
        report_id: `${sizeOfReportCollection + 1}`,
        title: 'سفارش خرید از' + s.supplier_name,
        description: 'این سفارش مربوط به خرید است',
        date: new Date('2023-11-29'),
        type: 'خرید',
        product_id: buyOrder.product_id,
        amount: buyOrder.amount,
      };
      //Create report
      await this.reportService.create(report);
      await this.buyOrderRepository.save(buyOrder);
      return { result: 'the buyOrder is created' };
    }
  }
  //This method return all buy orders
  async findAll(): Promise<ResultList<BuyOrderEntity>> {
    return await this.buyOrderRepository.findAll();
  }
  //This method update a buy order if it does exist
  async update(updatedBuyOrder: BuyOrderEntity): Promise<object> {
    //This query is better that be updated later...
    const updatedDocument = await MyDatabase.getDb().query(aql`
        FOR sup IN BuyOrders 
        FILTER sup.buyOrder_id == ${updatedBuyOrder.buy_order_id}
        UPDATE sup._key WITH ${updatedBuyOrder} IN BuyOrders
        RETURN OLD
    `);
    const isUpdated = await updatedDocument.next();
    if (isUpdated) {
      return { message: 'The buyOrder is successfully updated.' };
    } else {
      return { error: 'buyOrder not found' };
    }
  }
  //This method remove a buy order if it does exist
  async remove(buyOrderId: string): Promise<object> {
    //This query is better that be updated later...
    const deletedDocument = await MyDatabase.getDb().query(aql`
    FOR sup IN buyOrders
    FILTER sup.buyOrder_id == ${buyOrderId}
    REMOVE sup IN buyOrders
    RETURN OLD
    `);
    const isDeleted = await deletedDocument.all();
    if (isDeleted.length > 0) {
      return { result: 'buyOrder successfully deleted' };
    } else {
      return { result: 'buyOrder not found' };
    }
  }
  //This method filter buy orders that have specific status
  async findManyByStatus(status: string): Promise<object> {
    //This query search all buyOrders that their name starts with buyOrderName
    //ChatGPT did this query
    const buyOrder = await MyDatabase.getDb().query(aql`
    FOR buyOrder IN BuyOrders
    FILTER LIKE(buyOrder.status, CONCAT(${status}, '%'))
    RETURN buyOrder
    `);
    const isExist = buyOrder.all();
    if ((await isExist).length > 0) {
      return isExist;
    } else {
      return { error: 'buyOrder not found' };
    }
  }
  //This method filter buy orders based on their product id
  async findManyByProductId(productId: string): Promise<object> {
    //This query search all buyOrders that their name starts with buyOrderName
    //ChatGPT did this query
    const buyOrder = await MyDatabase.getDb().query(aql`
    FOR buyOrder IN BuyOrders
    FILTER LIKE(buyOrder.product_id, CONCAT(${productId}, '%'))
    RETURN buyOrder
    `);
    const isExist = buyOrder.all();
    if ((await isExist).length > 0) {
      return isExist;
    } else {
      return { error: 'buyOrder not found' };
    }
  }
  //This method filter buy orders based on their product id
  async findManyBySupplierId(supplierId: string): Promise<object> {
    //This query search all buyOrders that their name starts with buyOrderName
    //ChatGPT did this query
    const buyOrder = await MyDatabase.getDb().query(aql`
    FOR buyOrder IN BuyOrders
    FILTER LIKE(buyOrder.supplier_id, CONCAT(${supplierId}, '%'))
    RETURN buyOrder
    `);
    const isExist = buyOrder.all();
    if ((await isExist).length > 0) {
      return isExist;
    } else {
      return { error: 'buyOrder not found' };
    }
  }
}
