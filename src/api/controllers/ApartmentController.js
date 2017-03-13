import CrawlerService from '../services/CrawlerService';
import HTTPError from 'http-errors';

export default {
  startCrawler,
  stopCrawler
};

/**
 * Get test
 * @param {Object} req
 * @param {Object} res
 */
function startCrawler(req, res) {
  let crawlerPID = CrawlerService.startCrawler();
  res.json(crawlerPID);
}

function stopCrawler(req, res, next) {
  let crawlerPID = CrawlerService.stopCrawler();
  if (crawlerPID === null) next(HTTPError(400, 'No crawler is running'));
  else res.json(`Stop ${crawlerPID}`);
}
