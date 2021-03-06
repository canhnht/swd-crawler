import HTTPError from 'http-errors';
import CrawlerService from '../services/CrawlerService';
import MainDBService from '../../common/MainDBService';
import ApartmentDBService from '../../common/ApartmentDBService';
import {DomainName} from '../../common/models/Domain';
import {ApartmentProperty} from '../../common/models/ApartmentInfo';
import CrawlerStatus from '../../common/models/CrawlerStatus';


// ------------------------------------
// Exports
// ------------------------------------

export default {
  startCrawler,
  stopCrawler,
  saveConfig,
  getConfig
};


// ------------------------------------
// Private
// ------------------------------------

function updateCrawlerConfig(crawlerConfig) {
  if (!crawlerConfig) return Promise.resolve();
  return MainDBService.updateCrawlerConfig(crawlerConfig);
}

function startCrawlerWithConfig(crawlerConfig) {
  return updateCrawlerConfig(crawlerConfig)
    .then(() => {
      let crawlerPID = CrawlerService.startCrawler();
      return MainDBService.getCrawlerConfig();
    });
}

function normalizeRequestBody(reqBody) {
  reqBody.domains = reqBody.domains || [];
  if (typeof reqBody.domains == 'string')
    reqBody.domains = [ reqBody.domains ];
  let normalizedDomains = {};
  Object.keys(DomainName).forEach((key) => {
    normalizedDomains[key] = !!reqBody.domains.find((e) => e == key);
  });
  reqBody.domains = normalizedDomains;

  reqBody.apartmentInfo = reqBody.apartmentInfo || [];
  if (typeof reqBody.apartmentInfo == 'string')
    reqBody.apartmentInfo = [ reqBody.apartmentInfo ];
  let normalizedApartmentInfo = {};
  Object.keys(ApartmentProperty).forEach((key) => {
    normalizedApartmentInfo[key] = !!reqBody.apartmentInfo.find((e) => e == key);
  });
  reqBody.apartmentInfo = normalizedApartmentInfo;
}


// ------------------------------------
// Public
// ------------------------------------

function startCrawler(req, res, next) {
  if (CrawlerService.getCrawlerStatus() === CrawlerStatus.Running) {
    next(HTTPError(400, 'Crawler is running'));
    return;
  }
  normalizeRequestBody(req.body);
  let {dbHost, dbPort, dbName} = req.body;
  ApartmentDBService.checkConnection(dbHost, dbPort, dbName)
    .then((result) => {
      if (result.success) {
        let clearData = req.body.clearData;
        let crawlerConfig = req.body;
        delete crawlerConfig.clearData;
        if (clearData) {
          let clearURLsPromise = MainDBService.clearURLsDatabase();
          let clearApartments = ApartmentDBService.clearApartments();
          Promise.all([clearURLsPromise, clearApartments]).then(() => {
            return startCrawlerWithConfig(crawlerConfig);
          }).then((doc) => {
            res.json({
              crawlerConfig: doc,
              crawlerStatus: CrawlerService.getCrawlerStatus()
            });
          });
        } else {
          startCrawlerWithConfig(crawlerConfig).then((doc) => {
            res.json({
              crawlerConfig: doc,
              crawlerStatus: CrawlerService.getCrawlerStatus()
            });
          });
        }
      } else next(HTTPError(400, result.message));
    })
}

function stopCrawler(req, res, next) {
  let crawlerPID = CrawlerService.stopCrawler();
  if (crawlerPID === null) next(HTTPError(400, 'No crawler is running'));
  else MainDBService.getCrawlerConfig().then((doc) => {
    res.json({
      crawlerConfig: doc,
      crawlerStatus: CrawlerService.getCrawlerStatus()
    });
  });
}

function saveConfig(req, res, next) {
  normalizeRequestBody(req.body);
  delete req.body.clearData;
  let {dbHost, dbPort, dbName} = req.body;
  ApartmentDBService.checkConnection(dbHost, dbPort, dbName)
    .then((result) => {
      ApartmentDBService.disconnect();
      if (result.success) {
        MainDBService.updateCrawlerConfig(req.body).then(() => {
          MainDBService.getCrawlerConfig().then((doc) => {
            res.json({
              crawlerConfig: doc,
              crawlerStatus: CrawlerService.getCrawlerStatus()
            });
          });
        }).catch((err) => next(err));
      } else next(HTTPError(400, result.message));
    });
}

function getConfig(req, res, next) {
  MainDBService.getCrawlerConfig().then((doc) => {
    res.json({
      crawlerConfig: doc,
      crawlerStatus: CrawlerService.getCrawlerStatus()
    });
  }).catch((err) => next(err));
}
