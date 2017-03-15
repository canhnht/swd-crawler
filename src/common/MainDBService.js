import config from 'config';
import {ObjectID} from 'mongodb';
import MongoDB from './MongoDB';
import {Domain, DomainName} from './models/Domain';
import {ApartmentInfo} from './models/ApartmentInfo';


// ------------------------------------
// Exports
// ------------------------------------

export default {
  connect,
  initConfigs,
  updateCrawlerConfig,
  getCrawlerConfig,
  getUrls,
  getNextUrl,
  addUrls,
  clearURLsDatabase
};


// ------------------------------------
// Private
// ------------------------------------

let mainDB = null;

function getUrlsCollection(domainName) {
  let urls = mainDB.db.collection(`${domainName}:urls`);
  return urls;
}

function filterNewUrls(urls, listUrl) {
  let query = {
    $or: []
  };
  listUrl.forEach((url) => {
    query.$or.push({
      link: url.link,
      type: url.type
    })
  });
  return urls.find(query).toArray().then((docs) => {
    return listUrl.filter(
      (url) => !docs.find((item) => item.link === url.link)
    );
  });
}

// ------------------------------------
// Public
// ------------------------------------

function connect(clearDB = false) {
  console.log(`Before connect MainDB ${mainDB}`);
  mainDB = new MongoDB();
  return mainDB.connect().then(() => {
    if (clearDB) {
      return mainDB.clearDatabase();
    }
  })
}

function clearURLsDatabase() {
  return mainDB.db.collections().then((collections) => {
    let urlsCollections = collections.filter((c) => c.collectionName.endsWith(':urls'));
    return mainDB.dropCollections(urlsCollections);
  });
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
          [Domain.BatDongSan]: false,
          [Domain.MuaBanNhaDat]: false,
          [Domain.NhaDat24h]: false,
          [Domain.ALoNhaDat]: true
        },
        apartmentInfo: {
          [ApartmentInfo.RoomNumber]: false,
          [ApartmentInfo.Area]: false,
          [ApartmentInfo.Address]: false,
          [ApartmentInfo.Direction]: false,
          [ApartmentInfo.NumberOfBedrooms]: false,
          [ApartmentInfo.NumberOfBathrooms]: false,
          [ApartmentInfo.Project]: false,
          [ApartmentInfo.Floor]: false,
          [ApartmentInfo.Utilities]: false,
          [ApartmentInfo.Environment]: false,
          [ApartmentInfo.Description]: false,
          [ApartmentInfo.PricePerMetreSquare]: false,
          [ApartmentInfo.Price]: false,
          [ApartmentInfo.Images]: false,
          [ApartmentInfo.City]: false,
          [ApartmentInfo.District]: false,
          [ApartmentInfo.Title]: true
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

function getNextUrl(domainName, urlId) {
  let urls = getUrlsCollection(domainName);
  if (urlId) {
    return urls.find({
      _id: {
        $gt: ObjectID(urlId)
      }
    }).limit(1).toArray().then((docs) => {
      if (docs.length == 0) return null;
      return docs[0];
    });
  } else {
    return urls.find().limit(1).toArray().then((docs) => {
      if (docs.length == 0) return null;
      return docs[0];
    });
  }
}

function getUrls(domainName) {
  let urls = getUrlsCollection(domainName);
  return urls.find().toArray();
}

function addUrls(domainName, listUrl) {
  let urls = getUrlsCollection(domainName);
  return filterNewUrls(urls, listUrl).then((newUrls) => {
    if (newUrls.length == 0) return Promise.resolve();
    return urls.insertMany(newUrls.map((url) => ({
      link: url.link,
      domain: url.domain,
      type: url.type
    })));
  });
}
