import {EventEmitter} from 'events';
import request from 'request';
import Event from '../../common/Event';
import {DomainFolder} from '../../common/models/Domain';
import URLType from '../../common/models/URLType';
import URL from '../../common/models/URL';

class HTTPFetcher extends EventEmitter {
  constructor(urlFrontier) {
    super();
    this._urlFrontier = urlFrontier;
    this._handleApartmentUrl = this._handleApartmentUrl.bind(this);
  }

  run(domains, delayInSeconds) {
    this._domains = domains;
    this._delayInSeconds = delayInSeconds;

    let countSeconds = 0;
    this._fetchInterval = setInterval(() => {
      ++countSeconds;
      if (countSeconds >= delayInSeconds) {
        countSeconds = 0;
        this._processNextUrls();
      }
    }, 1000);
  }

  _processNextUrls() {
    let nextUrlsPromise = this._domains.map((domain) => {
      return this._urlFrontier.getNextUrl(domain);
    });
    Promise.all(nextUrlsPromise).then((nextUrls) => {
      nextUrls.filter((url) => !!url).forEach((url) => {
        this._fetchUrl(url).then((htmlCode) => {
          this._processPage(url, htmlCode);
        });
      });
    });
  }

  _processPage(url, htmlCode) {
    switch (url.type) {
      case URLType.PAGINATED_LIST_APARTMENT:
        const domainFolder = DomainFolder[url.domain];
        const ListApartmentPage = require(`../domains/${domainFolder}/ListApartmentPage`).default;
        const page = new ListApartmentPage(url, htmlCode);
        page.on(Event.ListApartmentPage.ApartmentURL, this._handleApartmentUrl);
        page.process();
        break;
      case URLType.ITEM_APARTMENT:

        break;
    }
  }

  _handleApartmentUrl(apartmentUrl) {
    console.log(apartmentUrl.link);
    this._urlFrontier.addUrl(apartmentUrl);
  }

  _fetchUrl(url) {
    const requestOptions = {
      method: 'GET',
      encoding: 'utf8',
      url: url.link
    };
    return new Promise((resolve, reject) => {
      request(requestOptions, (err, res, body) => {
        if (!err && res.statusCode === 200) {
          resolve(body);
        } else reject(err);
      })
    });
  }
}

export default HTTPFetcher;
