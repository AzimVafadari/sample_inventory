import { aql, Database } from 'arangojs';
export class MyDatabase {
  private static db = new Database({
    url: 'http://localhost:8529',
    databaseName: '_system',
    auth: { username: 'root', password: 'azim1383' },
  });
  getCollection(collection_name: string) {
    return MyDatabase.db.collection(collection_name);
  }
  static getDb() {
    return MyDatabase.db;
  }
  static async productIsExist(value: string): Promise<boolean> {
    const cursor = await this.getDb().query(aql`
    FOR p IN Products
    FILTER p.product_id == ${value}
    RETURN p
  `);
    const isExist = cursor.all();
    return (await isExist).length > 0;
  }
}
