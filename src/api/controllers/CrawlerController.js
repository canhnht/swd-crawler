import CrawlerService from '../services/CrawlerService';
import MainDBService from '../../common/MainDBService';
import ApartmentDBService from '../../common/ApartmentDBService';
import HTTPError from 'http-errors';


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


// ------------------------------------
// Public
// ------------------------------------

function startCrawler(req, res) {
  let clearData = req.body.clearData;
  let crawlerConfig = req.body.crawlerConfig;
  if (clearData) {
    let clearURLsPromise = MainDBService.clearURLsDatabase();
    let clearApartments = ApartmentDBService.clearApartments();
    Promise.all([clearURLsPromise, clearApartments]).then(() => {
      return startCrawlerWithConfig(crawlerConfig);
    }).then((doc) => {
      res.json(doc);
    });
  } else {
    startCrawlerWithConfig(crawlerConfig).then((doc) => {
      res.json(doc);
    });
  }
}

function stopCrawler(req, res, next) {
  let crawlerPID = CrawlerService.stopCrawler();
  if (crawlerPID === null) next(HTTPError(400, 'No crawler is running'));
  else MainDBService.getCrawlerConfig().then((doc) => {
    res.json(doc);
  });
}

function saveConfig(req, res, next) {
  MainDBService.updateCrawlerConfig(req.body).then(() => {
    MainDBService.getCrawlerConfig().then((doc) => {
      res.json(doc);
    });
  }).catch((err) => next(err));
}

function getConfig(req, res, next) {
  MainDBService.getCrawlerConfig().then((doc) => {
    res.json(doc);
  }).catch((err) => next(err));
}
