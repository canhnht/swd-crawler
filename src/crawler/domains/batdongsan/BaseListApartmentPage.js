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
    this._currentPageNumber = 1;
    this._numberOfPages = 10;
  }

  process() {
    _.times(this._numberOfPages, () => {
      process.nextTick(() => {
        let link = this._generatePageLink(this._currentPageNumber);
        this._currentPageNumber += 1;
        let listApartmentURL = new URL(this._baseUrl.domain, link, URLType.PAGINATED_LIST_APARTMENT);
        this.emit(Event.BaseListApartmentPage.ListApartmentURL, listApartmentURL);
      });
    });
  }

  _generatePageLink(pageNumber) {
    return `${this._baseUrl.link}/p${pageNumber}`;
  }
}

export default BaseListApartmentPage;
