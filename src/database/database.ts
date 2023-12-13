import { Database } from 'arangojs';
export class MyDatabase {
  private static db = new Database({
    url: 'http://127.0.0.1:8529',
    databaseName: '_SYSTEM',
    auth: { username: 'root', password: 'azim1383' },
  });
  getCollection(collection_name: string) {
    return MyDatabase.db.collection(collection_name);
  }
  static getDb() {
    return MyDatabase.db;
  }
}
