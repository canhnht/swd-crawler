import {EventEmitter} from 'events';
import axios from 'axios';
import config from 'config';
import Event from '../../common/Event';

class HTTPFetcher extends EventEmitter {
  constructor(urlFrontier) {
    super();
  }

  bindEvents(urlFrontier) {
    this._urlFrontier = urlFrontier;
    this._urlFrontier.on(Event.URLFrontier.NextURL, (url) => {
      this._fetchPage(url).then((htmlCode) => {
        this.emit(Event.HTTPFetcher.FetchedPage, url, htmlCode);
      });
    })
  }

  _fetchPage(url) {
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
