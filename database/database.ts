import { Database } from 'arangojs';
export class MyDatabase {
  private static db = new Database({
    url: 'http://127.0.0.1:8529',
    databaseName: 'pancakes',
    auth: { username: 'root', password: 'hunter2' },
  });
  static getCollection(collection_name: string) {
    return this.db.collection(collection_name);
  }
}
