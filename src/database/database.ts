import { Database } from 'arangojs';
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
}
