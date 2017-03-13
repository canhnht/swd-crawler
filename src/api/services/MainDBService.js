import MongoDB from '../../common/MongoDB';
import {Domain} from '../../common/models/Domain';
import {ApartmentInfo} from '../../common/models/ApartmentInfo';
import config from 'config';


// ------------------------------------
// Exports
// ------------------------------------

export default {
  connect,
  initConfigs,
  updateCrawlerConfig,
  getCrawlerConfig
};


// ------------------------------------
// Private
// ------------------------------------

let mainDB = null;


// ------------------------------------
// Public
// ------------------------------------

function connect() {
  mainDB = new MongoDB();
  return mainDB.connect();
}

function initConfigs() {
  let configs = mainDB.db.collection('configs');
  return configs.count().then((count) => {
    if (count == 0) {
      return configs.insertOne({
        name: 'crawlerConfig',
        dbHost: config.get('DB_HOST'),
        dbPort: config.get('DB_PORT'),
        dbName: config.get('DB_NAME'),
        domains: {
          [Domain.BatDongSan]: true,
          [Domain.MuaBanNhaDat]: true,
          [Domain.NhaDat24h]: true,
          [Domain.ALoNhaDat]: true
        },
        apartmentInfo: {
          [ApartmentInfo.RoomNumber]: true,
          [ApartmentInfo.Area]: true,
          [ApartmentInfo.Address]: true,
          [ApartmentInfo.Direction]: true,
          [ApartmentInfo.NumberOfBedrooms]: true,
          [ApartmentInfo.NumberOfBathrooms]: true,
          [ApartmentInfo.Project]: true,
          [ApartmentInfo.Floor]: true,
          [ApartmentInfo.Utilities]: true,
          [ApartmentInfo.Environment]: true,
          [ApartmentInfo.Description]: true,
          [ApartmentInfo.PricePerMetreSquare]: true,
          [ApartmentInfo.Price]: true,
          [ApartmentInfo.Images]: true,
          [ApartmentInfo.City]: true,
          [ApartmentInfo.District]: true
        },
        secondsBetweenRequest: 1
      });
    }
  });
}

function updateCrawlerConfig(crawlerConfig) {
  let configs = mainDB.db.collection('configs');
  return configs.updateOne({
    name: 'crawlerConfig'
  }, {
    '$set': crawlerConfig
  }, {
    upsert: true
  });
}

function getCrawlerConfig() {
  let configs = mainDB.db.collection('configs');
  return configs.findOne({
    name: 'crawlerConfig'
  });
}
