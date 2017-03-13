import {MongoClient} from 'mongodb';
import config from 'config';

class MongoDB {
  constructor(host, port, dbName) {
    this.host = host || config.get('DB_HOST');
    this.port = port || config.get('DB_PORT');
    this.dbName = dbName || config.get('DB_NAME');
    this.db = null;
  }

  connect() {
    const dbURL = `mongodb://${this.host}:${this.port}/${this.dbName}`;
    return MongoClient.connect(dbURL).then((db) => {
      this.db = db;
      return db;
    });
  }
}

export default MongoDB;
