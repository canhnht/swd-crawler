import config from 'config';
import MongoDB from './MongoDB';
import MainDBService from './MainDBService';


// ------------------------------------
// Exports
// ------------------------------------

export default {
  connect,
  addApartment,
  getApartments,
  clearApartments,
  checkConnection,
  disconnect
};


// ------------------------------------
// Private
// ------------------------------------

let apartmentDB = null;

function connectDatabase(host, port, dbName) {
  console.log(`Before connect ApartmentDB ${apartmentDB}`);
  apartmentDB = new MongoDB(host, port, dbName);
  return apartmentDB.connect();
}


// ------------------------------------
// Public
// ------------------------------------

function connect() {
  console.log(`Before connect ApartmentDB ${apartmentDB}`);
  if (apartmentDB) return Promise.resolve();
  return MainDBService.getCrawlerConfig().then((doc) => {
    return connectDatabase(doc.dbHost, doc.dbPort, doc.dbName);
  });
}

function disconnect() {
  return apartmentDB.db.close().then(() => {
    apartmentDB = null;
  });
}

function checkConnection(host, port, dbName) {
  if (!host || !port || !dbName) return Promise.resolve({
    success: false,
    message: 'Invalid database connection'
  });
  return MongoDB.isValidConnection(host, port, dbName).then((result) => {
    if (result.success) {
      return connectDatabase(host, port, dbName)
        .then(() => result);
    } else return result;
  });
}

function clearApartments() {
  return apartmentDB.dropCollection('apartments');
}

function addApartment(apartment) {
  let apartments = apartmentDB.db.collection('apartments');
  return apartments.updateOne({
    HashValue: apartment.HashValue
  }, {
    '$set': apartment
  }, {
    upsert: true
  });
}

function getApartments(query, offset, limit) {
  let apartments = apartmentDB.db.collection('apartments');
  return apartments.find(query).skip(offset).limit(limit).toArray()
    .then((docs) => {
      docs.forEach((doc) => {
        delete doc.HashValue;
      });
      return docs;
    });
}

function getNumberApartments() {
  let apartments = apartmentDB.db.collection('apartments');
  return apartments.count();
}
