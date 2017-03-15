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
  checkConnection
};


// ------------------------------------
// Private
// ------------------------------------

let apartmentDB = null;

function connectDatabase(host, port, dbName) {
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
    Title: apartment.Title
  }, {
    '$set': apartment
  }, {
    upsert: true
  });
}

function getApartments(query, offset, limit) {
  let apartments = apartmentDB.db.collection('apartments');
  return apartments.find(query).skip(offset).limit(limit).toArray();
}

function getNumberApartments() {
  let apartments = apartmentDB.db.collection('apartments');
  return apartments.count();
}
