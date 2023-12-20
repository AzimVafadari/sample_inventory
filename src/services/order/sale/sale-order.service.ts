import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { ArangoRepository, InjectRepository, ResultList } from 'nest-arango';
import { MyDatabase } from 'src/database/database';
import { SaleOrderEntity } from '../../../entities/order/sale/sale-order.entity';
import { ProductEntity } from '../../../entities/product/product.entity';

@Injectable()
export class saleOrderService {
  constructor(
    @InjectRepository(SaleOrderEntity)
    private readonly saleOrderRepository: ArangoRepository<SaleOrderEntity>,
  ) {}
  //This method create a sale order if it doesn't exist
  async create(saleOrder: SaleOrderEntity): Promise<object> {
    const cursor = await MyDatabase.getDb().query(aql`
    FOR saleOrder IN SaleOrders
    FILTER saleOrder.saleOrder_id == ${saleOrder.sale_order_id}
    RETURN saleOrder
  `);
    const isExist = cursor.all();
    if ((await isExist).length > 0) {
      return { error: 'saleOrder already exist' };
    } else {
      const productIsExist = await MyDatabase.isExist(
        'Products',
        'product_id',
        saleOrder.product_id,
      );
      if (productIsExist) {
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
          const nb = `${newBalance} ${scale[0]}`;
          p.balance = nb;
          await MyDatabase.getDb().query(aql`
          FOR p IN Products 
          FILTER p.product_id == ${p.product_id}
          UPDATE p._key WITH ${p} IN Products
          `);
          await this.saleOrderRepository.save(saleOrder);
          return { result: 'the saleOrder is created' };
        } else {
          return { result: 'Balance of this product is not enough' };
        }
      } else {
        return { result: 'Please first create the product' };
      }
    }
  }
  //This method return all buy orders
  async findAll(): Promise<ResultList<SaleOrderEntity>> {
    return await this.saleOrderRepository.findAll();
  }
  //This method update a buy order if it does exist
  async update(updatedSaleOrder: SaleOrderEntity): Promise<object> {
    //This query is better that be updated later...
    const updatedDocument = await MyDatabase.getDb().query(aql`
        FOR so IN SaleOrders 
        FILTER so.saleOrder_id == ${updatedSaleOrder.sale_order_id}
        UPDATE so._key WITH ${updatedSaleOrder} IN SaleOrders
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
    FILTER so.saleOrder_id == ${saleOrderId}
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
  async findManyBySupplierId(customerId: string): Promise<object> {
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
