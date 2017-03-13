import config from 'config';
import MongoDB from './MongoDB';
import MainDBService from './MainDBService';


// ------------------------------------
// Exports
// ------------------------------------

export default {
  connect
};


// ------------------------------------
// Private
// ------------------------------------

let apartmentDB = null;


// ------------------------------------
// Public
// ------------------------------------

function connect() {
  console.log(`Before connect ${apartmentDB}`);
  return MainDBService.getCrawlerConfig((data) => {
    apartmentDB = new MongoDB(data.dbHost, data.dbPort, data.dbName);
    return apartmentDB.connect();
  });
}
