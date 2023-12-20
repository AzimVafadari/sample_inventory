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
  static async isExist(
    collectionName: string,
    property: string,
    value: string,
  ): Promise<boolean> {
    const cursor = await this.getDb().query(aql`
    FOR e IN ${collectionName}
    FILTER e.${property} == e.${value}
    RETURN e
  `);
    const isExist = cursor.all();
    if ((await isExist).length > 0) {
      return true;
    } else {
      return false;
    }
  }
}
