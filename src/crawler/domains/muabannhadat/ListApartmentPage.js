import {EventEmitter} from 'events';
import cheerio from 'cheerio';
import Event from '../../../common/Event';
import {Domain, DomainName} from '../../../common/models/Domain';
import URLType from '../../../common/models/URLType';
import URL from '../../../common/models/URL';

class ListApartmentPage extends EventEmitter {
  constructor(baseUrl, htmlCode) {
    super();
    this._baseUrl = baseUrl;
    this._htmlCode = htmlCode;
    this._currentPageNumber = 0;
  }

  process() {
    let $ = cheerio.load(this._htmlCode);
    $('.title-filter-link').each((idx, aNode) => {
      let apartmentLink = $(aNode).attr('href');
      apartmentLink = this._getFullLink(apartmentLink);
      let apartmentURL = new URL(Domain.MuaBanNhaDat, apartmentLink, URLType.ITEM_APARTMENT);
      this.emit(Event.ListApartmentPage.ApartmentURL, apartmentURL);
    });
  }

  _getFullLink(link) {
    return `${DomainName[this._baseUrl.domain]}${link}`;
  }
}

export default ListApartmentPage;
