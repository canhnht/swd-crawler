import {EventEmitter} from 'events';
import axios from 'axios';
import config from 'config';
import Event from '../../common/Event';

const THRESHOLD_EMPTY_URL = 10;

class HTTPFetcher extends EventEmitter {
  constructor(urlFrontier) {
    super();
    this._urlFrontier = urlFrontier;
    this._fetchInterval = null;
    this._timesEmptyURLs = 0;
  }

  run(domains, delayInSeconds) {
    this._domains = domains;
    this._delayInSeconds = delayInSeconds;
    this._startFetchInterval(1000);
  }

  _startFetchInterval(intervalStep) {
    let countSeconds = 0;
    this._fetchInterval = setInterval(() => {
      ++countSeconds;
      console.log('fetchInterval', countSeconds);
      if (countSeconds >= this._delayInSeconds) {
        countSeconds = 0;
        this._processNextUrls();
      }
    }, intervalStep);
  }

  _stopFetchInterval() {
    if (!this._fetchInterval) return;
    clearInterval(this._fetchInterval);
    this._fetchInterval = null;
  }

  _processNextUrls() {
    let nextUrlsPromise = this._domains.map((domain) => {
      return this._urlFrontier.getNextUrl(domain);
    });
    Promise.all(nextUrlsPromise).then((nextUrls) => {
      nextUrls = nextUrls.filter((url) => !!url);
      if (nextUrls.length == 0) {
        this._timesEmptyURLs += 1;
        if (this._timesEmptyURLs >= THRESHOLD_EMPTY_URL) {
          this._timesEmptyURLs = 0;
          this._stopFetchInterval();
          this.emit(Event.HTTPFetcher.Done);
        }
      } else {
        nextUrls.forEach((url) => {
          console.log('nextURL', url);
          this._fetchUrl(url).then((htmlCode) => {
            this.emit(Event.HTTPFetcher.FetchedPage, url, htmlCode);
          });
        });
      }
    });
  }

  _fetchUrl(url) {
    let requestOptions = {
      url: url.link,
      method: 'get',
      responseType: 'text',
      proxy: config.get('AXIOS_PROXY')
    };
    return axios(requestOptions).then((res) => {
      if (res.status === 200)
        return res.data;
      else throw new Error(`${res.status} - ${res.statusText}`);
    });
  }
}

export default HTTPFetcher;
