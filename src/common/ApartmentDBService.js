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
  clearApartments
};


// ------------------------------------
// Private
// ------------------------------------

let apartmentDB = null;


// ------------------------------------
// Public
// ------------------------------------

function connect() {
  console.log(`Before connect ApartmentDB ${apartmentDB}`);
  return MainDBService.getCrawlerConfig().then((doc) => {
    apartmentDB = new MongoDB(doc.dbHost, doc.dbPort, doc.dbName);
    return apartmentDB.connect();
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
