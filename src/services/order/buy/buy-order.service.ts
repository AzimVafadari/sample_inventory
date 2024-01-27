import { Injectable } from '@nestjs/common';
import { aql } from 'arangojs';
import { ArangoRepository, InjectRepository, ResultList } from 'nest-arango';
import { MyDatabase } from 'src/database/database';
import { BuyOrderEntity } from '../../../entities/order/buy/buy-order.entity';
import { ProductEntity } from '../../../entities/product/product.entity';
import { ReportEntity } from '../../../entities/report/report.entity';
import { SupplierEntity } from '../../../entities/supplier/supplier.entity';
import { ReportService } from '../../report/report.service';
import { ProductService } from '../../product/product.service';

@Injectable()
export class BuyOrderService {
  constructor(
    @InjectRepository(BuyOrderEntity)
    private readonly buyOrderRepository: ArangoRepository<BuyOrderEntity>,
    private readonly reportService: ReportService,
    private readonly productService: ProductService,
  ) {}

  //This method create a buy order if it doesn't exist
  async create(buyOrder: BuyOrderEntity): Promise<object> {
    const isExist = await MyDatabase.productIsExist(buyOrder.product_id);
    if (!isExist) {
      return { result: 'Please first create the product' };
    }

    const cursor = await MyDatabase.getDb().query(aql`
    FOR p IN Products
    FILTER p.product_id == ${buyOrder.product_id}
    RETURN p
  `);
    const product = await cursor.next();
    if (product.scale !== buyOrder.scale) {
      return { result: 'scale is not correct' };
    }

    //Find customer
    const supplier = await MyDatabase.getDb().query(aql`
          FOR s IN Suppliers
          FILTER s._id == ${buyOrder.supplier_id}
          RETURN s
          `);
    const s: SupplierEntity = await supplier.next();
    if (s === undefined) return { result: 'supplier does not exist' };
    const report: ReportEntity = {
      title: 'سفارش خرید از ' + s.supplier_name,
      content: ['این سفارش مربوط به خرید است'],
      date: new Date(),
    };
    //Create report
    await this.reportService.create(report);
    await this.buyOrderRepository.save(buyOrder);
    return { result: 'the buyOrder is created' };
  }

  //This method return all buy orders
  async findAll(): Promise<ResultList<BuyOrderEntity>> {
    return await this.buyOrderRepository.findAll();
  }

  //This method update a buy order if it does exist
  async update(_id: string, updatedBuyOrder: BuyOrderEntity): Promise<object> {
    //This query is better that be updated later...
    const updatedDocument = await MyDatabase.getDb().query(aql`
        FOR bo IN BuyOrders 
        FILTER bo._id == ${_id}
        UPDATE bo WITH ${updatedBuyOrder} IN BuyOrders
        RETURN OLD
    `);
    const isUpdated: BuyOrderEntity = await updatedDocument.next();
    if (
      isUpdated.status != 'finished' &&
      updatedBuyOrder.status == 'finished'
    ) {
      //Update product by new balance
      const product = await MyDatabase.getDb().query(aql`
        FOR product in Products
        FILTER product.product_id == ${updatedBuyOrder.product_id}
        RETURN product
      `);
      const p: ProductEntity = await product.next();
      p.balance = p.balance + updatedBuyOrder.amount;
      await this.productService.updateProduct(p);
    }
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
    FOR bo IN BuyOrders
    FILTER bo._id == ${buyOrderId}
    REMOVE bo IN BuyOrders
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
    FILTER buyOrder.product_id == ${productId}
    RETURN buyOrder
    `);
    const buyOrders = await buyOrder.all();
    console.log(buyOrders);
    const isExist = (await buyOrders).length > 0;
    if (isExist) {
      return buyOrders;
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
