import { aql, Database } from "arangojs";

export class MyDatabase {
  private static db = new Database({
    url: "http://localhost:8529",
    databaseName: "_system",
    auth: { username: "root", password: "azim1383" }
  });

  static getDb() {
    return MyDatabase.db;
  }

  static async productIsExist(value: string): Promise<boolean> {
    const cursor = await this.getDb().query(aql`
    FOR p IN Products
    FILTER p.product_id == ${value}
    RETURN p
  `);
    const isExist = await cursor.all();
    return isExist.length > 0;
  }

  static async supplierIsExist(value: string): Promise<boolean> {
    const cursor = await this.getDb().query(aql`
    FOR s IN Suppliers
    FILTER s.supplier_id == ${value}
    RETURN s
  `);
    const isExist = cursor.all();
    return (await isExist).length > 0;
  }

  static async categoryIsExist(value: string): Promise<boolean> {
    const cursor = await this.getDb().query(aql`
    FOR category IN Categories
    FILTER category.category_id == ${value}
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
}

