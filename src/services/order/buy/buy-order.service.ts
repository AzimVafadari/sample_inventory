import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { ArangoRepository, InjectRepository, ResultList } from 'nest-arango';
import { MyDatabase } from 'src/database/database';
import { BuyOrderEntity } from '../../../entities/order/buy/buy-order.entity';

@Injectable()
export class BuyOrderService {
  constructor(
    @InjectRepository(BuyOrderEntity)
    private readonly buyOrderRepository: ArangoRepository<BuyOrderEntity>,
  ) {}
  //This method create a buy order if it doesn't exist
  async create(buyOrder: BuyOrderEntity): Promise<object> {
    const cursor = await MyDatabase.getDb().query(aql`
    FOR buyOrder IN BuyOrders
    FILTER buyOrder.buyOrder_id == ${buyOrder.buy_order_id}
    RETURN buyOrder
  `);
    const isExist = cursor.all();
    if ((await isExist).length > 0) {
      return { error: 'buyOrder already exist' };
    } else {
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
    const isDeleted = deletedDocument.next();
    if (isDeleted != undefined) {
      return { error: 'this user  doesnt exist' };
    } else {
      return { result: 'buyOrder successfully deleted' };
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
