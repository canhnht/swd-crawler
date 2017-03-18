import {EventEmitter} from 'events';
import _ from 'lodash';
import Event from '../../../common/Event';
import {Domain, DomainName} from '../../../common/models/Domain';
import URLType from '../../../common/models/URLType';
import URL from '../../../common/models/URL';

class BaseListApartmentPage extends EventEmitter {
  constructor(baseUrl, htmlCode) {
    super();
    this._baseUrl = baseUrl;
    this._htmlCode = htmlCode;
    this._currentPageNumber = 0;
    this._numberOfPages = 500;
  }

  process() {
    let pageLinksPromise = _.times(this._numberOfPages, () => {
      return () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let link = this._generatePageLink(this._currentPageNumber);
            this._currentPageNumber += 1;
            let listApartmentURL = new URL(this._baseUrl.domain, link, URLType.PAGINATED_LIST_APARTMENT);
            this.emit(Event.BaseListApartmentPage.ListApartmentURL, listApartmentURL);
            resolve();
          }, 1000);
        });
      };
    });
    pageLinksPromise.reduce((p, e) => p.then(e), Promise.resolve());
  }

  _generatePageLink(pageNumber) {
    return `${this._baseUrl.link}?p=${pageNumber}`;
  }
}

export default BaseListApartmentPage;
