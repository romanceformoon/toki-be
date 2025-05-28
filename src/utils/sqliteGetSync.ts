import { Database } from 'sqlite3';

export const sqliteGetSync = (db: Database, query: string) => {
  return new Promise<any>(function (resolve, reject) {
    db.get(query, function (err: Error, row: any) {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
};
