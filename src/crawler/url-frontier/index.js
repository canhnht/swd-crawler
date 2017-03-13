import MainDBService from '../../common/MainDBService';
import ApartmentDBService from '../../common/ApartmentDBService';
import {DomainName, DomainFolder} from '../../common/models/Domain';
import URL from '../../common/models/URL';

class URLFrontier {
  constructor() {
  }

  init(domains) {
    this._domains = domains;
    this._currentUrlId = {};
    domains.forEach((domain) => {
      this._currentUrlId[domain] = null;
    });
    console.log('currentUrlId', this._currentUrlId);

    return this.initSeedUrls(domains).then(() => {
      return MainDBService.getUrls(DomainName[domains[0]]);
    }).then((docs) => {
      console.log(`seedUrls ${DomainName[domains[0]]}`, docs);
    });
  }

  initSeedUrls(domains) {
    let initSeedUrlsPromise = domains.map((domain) => {
      let domainName = DomainName[domain];
      let seedUrls = require(`../domains/${DomainFolder[domain]}/SeedURLs`).default;
      return MainDBService.addUrls(domainName, seedUrls);
    });
    return Promise.all(initSeedUrlsPromise);
  }

  getNextUrl(domain) {
    return MainDBService.getNextUrl(DomainName[domain], this._currentUrlId[domain])
      .then((doc) => {
        if (doc) {
          this._currentUrlId[domain] = doc._id;
          return new URL(doc.domain, doc.link, doc.type);
        } else return null;
      });
  }

  addUrl(url) {
    return MainDBService.addUrls(DomainName[url.domain], [url]);
  }
}

export default URLFrontier;
