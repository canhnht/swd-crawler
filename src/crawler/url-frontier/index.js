import {EventEmitter} from 'events';
import MainDBService from '../../common/MainDBService';
import {DomainName, DomainFolder} from '../../common/models/Domain';
import URL from '../../common/models/URL';
import Event from '../../common/Event';

const THRESHOLD_EMPTY_URL = 10;

class URLFrontier extends EventEmitter {
  constructor() {
    super();
    this._addUrl = this._addUrl.bind(this);
    this._fetchInterval = null;
    this._timesEmptyURLs = 0;
  }

  bindEvents(extracter) {
    this._extracter = extracter;
    this._extracter.on(Event.Extracter.ExtractedURL, this._addUrl);
  }

  init(domains, delayInSeconds) {
    this._domains = domains;
    this._delayInSeconds = delayInSeconds;
    this._currentUrlId = {};
    domains.forEach((domain) => {
      this._currentUrlId[domain] = null;
    });

    return this._initSeedUrls(domains).then(() => {
      return MainDBService.getUrls(DomainName[domains[0]]);
    }).then((docs) => {
      console.log(`seedUrls ${DomainName[domains[0]]}`, docs);
    });
  }

  run() {
    this._startFetchInterval(1000);
  }

  _startFetchInterval(intervalStep) {
    let countSeconds = 0;
    this._fetchInterval = setInterval(() => {
      ++countSeconds;
      console.log('fetchInterval', countSeconds);
      if (countSeconds >= this._delayInSeconds) {
        countSeconds = 0;
        this._getNextUrls();
      }
    }, intervalStep);
  }

  _getNextUrls() {
    let nextUrlsPromise = this._domains.map((domain) => {
      return this._getNextUrl(domain);
    });
    Promise.all(nextUrlsPromise).then((nextUrls) => {
      nextUrls = nextUrls.filter((url) => !!url);
      if (nextUrls.length == 0) {
        this._timesEmptyURLs += 1;
        if (this._timesEmptyURLs >= THRESHOLD_EMPTY_URL) {
          this._timesEmptyURLs = 0;
          this._stopFetchInterval();
          this.emit(Event.URLFrontier.OutOfURL);
        }
      } else {
        nextUrls.forEach((url) => {
          console.log('nextURL', url);
          process.nextTick(() => {
            this.emit(Event.URLFrontier.NextURL, url);
          });
        });
      }
    });
  }

  _stopFetchInterval() {
    if (!this._fetchInterval) return;
    clearInterval(this._fetchInterval);
    this._fetchInterval = null;
  }

  _initSeedUrls(domains) {
    let initSeedUrlsPromise = domains.map((domain) => {
      let domainName = DomainName[domain];
      let seedUrls = require(`../domains/${DomainFolder[domain]}/SeedURLs`).default;
      return MainDBService.addUrls(domainName, seedUrls);
    });
    return Promise.all(initSeedUrlsPromise);
  }

  _getNextUrl(domain) {
    return MainDBService.getNextUrl(DomainName[domain], this._currentUrlId[domain])
      .then((doc) => {
        if (doc) {
          this._currentUrlId[domain] = doc._id;
          return new URL(doc.domain, doc.link, doc.type);
        } else return null;
      });
  }

  _addUrl(url) {
    return MainDBService.addUrls(DomainName[url.domain], [url]);
  }
}

export default URLFrontier;
