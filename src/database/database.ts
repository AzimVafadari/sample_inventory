import { aql, Database } from 'arangojs';
import { NotFoundException } from '@nestjs/common';

export class MyDatabase {
  private static db = new Database({
    url: 'http://localhost:8529',
    databaseName: '_system',
    auth: { username: 'root', password: 'azim1383' },
  });

  static getDb() {
    return MyDatabase.db;
  }

  static async productIsExist(product_id: string): Promise<boolean> {
    const cursor = await this.getDb().query(aql`
    FOR p IN Products
    FILTER p.product_id == ${product_id}
    RETURN p
  `);
    const isExist = await cursor.all();
    return isExist.length > 0;
  }

  static async supplierIsExist(value: string): Promise<boolean> {
    const cursor = await this.getDb().query(aql`
    FOR s IN Suppliers
    FILTER s._id == ${value}
    RETURN s
  `);
    const isExist = await cursor.all();
    return isExist.length > 0;
  }

  static async categoryIsExist(value: string): Promise<boolean> {
    const cursor = await this.getDb().query(aql`
    FOR category IN Categories
    FILTER category._id == ${value}
    RETURN category
  `);
    const isExist = cursor.all();
    return (await isExist).length > 0;
  }

  static async getCollectionSize(collection_name: string) {
    const collectionSize = await MyDatabase.getDb()
      .collection(collection_name)
      .count();
    return collectionSize.count;
  }

  static async findByKey(
    key: string,
    collectionName: string,
    error_message: string,
  ) {
    const document = await this.getDb()
      .collection(collectionName)
      .lookupByKeys([key]);
    if (document.length !== 0) return document;
    else throw new Error(error_message);
  }

  // static async isExist(key: string, collectionName: string) {
  //   const isExist = await this.getDb()
  //     .collection(collectionName)
  //     .documentExists(key);
  //   return isExist;
  // }
  static async buyOrderIsExist(_id: string) {
    const cursor = await this.getDb().query(aql`
    FOR bo IN BuyOrders
    FILTER bo._id == ${_id}
    RETURN bo
  `);
    const isExist = await cursor.all();
    return isExist.length > 0;
  }

  static async customerIsExist(_id: string) {
    const cursor = await this.getDb().query(aql`
    FOR customer IN Customers
    FILTER customer._id == ${_id}
    RETURN customer
  `);
    const isExist = await cursor.all();
    return isExist.length > 0;
  }

  static async saleOrderIsExist(_id: string) {
    const cursor = await this.getDb().query(aql`
    FOR so IN SaleOrders
    FILTER so._id == ${_id}
    RETURN so
  `);
    const isExist = await cursor.all();
    return isExist.length > 0;
  }
}
