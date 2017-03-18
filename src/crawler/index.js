import URLFrontier from './url-frontier';
import HTTPFetcher from './http-fetcher';
import Extracter from './extracter';
import MainDBService from '../common/MainDBService';
import ApartmentDBService from '../common/ApartmentDBService';
import Event from '../common/Event';

class Crawler {
  constructor() {
    this._urlFrontier = new URLFrontier();
    this._httpFetcher = new HTTPFetcher();
    this._extracter = new Extracter();

    this._urlFrontier.bindEvents(this._extracter);
    this._httpFetcher.bindEvents(this._urlFrontier);
    this._extracter.bindEvents(this._httpFetcher);

    this._urlFrontier.on(Event.URLFrontier.OutOfURL, () => {
      console.log('Finish crawling');
      process.exit();
    });
  }

  run() {
    MainDBService.connect()
      .then(() => ApartmentDBService.connect())
      .then(() => MainDBService.getCrawlerConfig())
      .then((doc) => {
        let domains = Object.keys(doc.domains)
          .filter((domain) => doc.domains[domain]);
        let apartmentProperties = Object.keys(doc.apartmentInfo)
          .filter((key) => doc.apartmentInfo[key]);

        return this._urlFrontier.init(domains, doc.secondsBetweenRequest).then(() => {
          this._urlFrontier.run();
          this._extracter.run(apartmentProperties);
        });
      });
  }
}

let crawler = new Crawler();
crawler.run();

export default Crawler;
