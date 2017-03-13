import URLFrontier from './url-frontier';
import HTTPFetcher from './http-fetcher';
import Extractor from './extractor';

class Crawler {
  constructor() {
    this.urlFrontier = new URLFrontier();
    this.httpFetcher = new HTTPFetcher(this.urlFrontier);
    this.extractor = new Extractor(this.httpFetcher);
  }

  run() {
    let count = 0;
    let interval = setInterval(() => {
      console.log(`Crawler is running... ${++count}`);
      if (count == 10) clearInterval(interval);
    }, 1000);
  }
}

let crawler = new Crawler();
crawler.run();

export default Crawler;
