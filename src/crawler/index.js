import URLFrontier from './url-frontier';
import HTTPFetcher from './http-fetcher';
import Extracter from './extracter';
import MainDBService from '../common/MainDBService';

class Crawler {
  constructor() {
    this._urlFrontier = new URLFrontier();
    this._httpFetcher = new HTTPFetcher(this._urlFrontier);
    this._extracter = new Extracter(this._httpFetcher);
  }

  run() {
    MainDBService.connect().then(() => {
      return MainDBService.getCrawlerConfig();
    }).then((doc) => {
      let domains = Object.keys(doc.domains)
        .filter((domain) => doc.domains[domain]);
      return this._urlFrontier.init(domains).then(() => {
        this._httpFetcher.run(domains, doc.secondsBetweenRequest);
        this._extracter.run();
      });
    });
  }
}

let crawler = new Crawler();
crawler.run();

export default Crawler;
