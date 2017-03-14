import {MongoClient} from 'mongodb';
import config from 'config';

class MongoDB {
  constructor(host, port, dbName) {
    this._host = host || config.get('DB_HOST');
    this._port = port || config.get('DB_PORT');
    this._dbName = dbName || config.get('DB_NAME');
    this._db = null;
  }

  connect() {
    const dbURL = `mongodb://${this._host}:${this._port}/${this._dbName}`;
    return MongoClient.connect(dbURL).then((db) => {
      this._db = db;
      return db;
    });
  }

  dropCollection(name) {
    return this._db.dropCollection(name).catch(() => {});
  }

  dropCollections(collections) {
    if (collections.length == 0) return Promise.resolve();
    let dropCollectionsPromise = collections.map((c) => {
      return this._db.dropCollection(c.collectionName);
    });
    return Promise.all(dropCollectionsPromise);
  }

  clearDatabase() {
    return this._db.collections().then((collections) => {
      return this.dropCollections(collections);
    });
  }

  get db() {
    return this._db;
  }
}

export default MongoDB;
