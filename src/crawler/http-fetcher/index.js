import {EventEmitter} from 'events';
import axios from 'axios';
import Event from '../../common/Event';

class HTTPFetcher extends EventEmitter {
  constructor(urlFrontier) {
    super();
    this._urlFrontier = urlFrontier;
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
        console.log('nextURL', url);
        this._fetchUrl(url).then((htmlCode) => {
          this.emit(Event.HTTPFetcher.FetchedPage, url, htmlCode);
        });
      });
    });
  }

  _fetchUrl(url) {
    let requestOptions = {
      url: url.link,
      method: 'get',
      responseType: 'text'
    };
    return axios(requestOptions).then((res) => {
      if (res.status === 200)
        return res.data;
      else throw new Error(`${res.status} - ${res.statusText}`);
    });
  }
}

export default HTTPFetcher;
