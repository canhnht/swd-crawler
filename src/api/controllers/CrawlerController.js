import CrawlerService from '../services/CrawlerService';
import MainDBService from '../services/MainDBService';
import HTTPError from 'http-errors';


// ------------------------------------
// Exports
// ------------------------------------

export default {
  startCrawler,
  stopCrawler,
  saveConfig
};


// ------------------------------------
// Public
// ------------------------------------

function startCrawler(req, res) {
  let crawlerPID = CrawlerService.startCrawler();
  res.json(crawlerPID);
}

function stopCrawler(req, res, next) {
  let crawlerPID = CrawlerService.stopCrawler();
  if (crawlerPID === null) next(HTTPError(400, 'No crawler is running'));
  else res.json(`Stop ${crawlerPID}`);
}

function saveConfig(req, res, next) {
  MainDBService.updateCrawlerConfig(req.body).then(() => {
    MainDBService.getCrawlerConfig().then((data) => {
      res.json(data);
    });
  }).catch((err) => next(err));
}
