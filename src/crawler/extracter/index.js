import Event from '../../common/Event';
import {ApartmentProperty} from '../../common/models/ApartmentInfo';
import ApartmentDBService from '../../common/ApartmentDBService';
import URLType from '../../common/models/URLType';
import {DomainFolder} from '../../common/models/Domain';

class Extracter {
  constructor(httpFetcher, urlFrontier) {
    this._httpFetcher = httpFetcher;
    this._urlFrontier = urlFrontier;
    this._handleApartment = this._handleApartment.bind(this);
    this._handleExtractedURL = this._handleExtractedURL.bind(this);
    this._processPage = this._processPage.bind(this);
  }

  run(apartmentProperties) {
    this._apartmentProperties = apartmentProperties;
    this._httpFetcher.on(Event.HTTPFetcher.FetchedPage, this._processPage);
  }

  _processPage(url, htmlCode) {
    const domainFolder = DomainFolder[url.domain];
    switch (url.type) {
      case URLType.BASE_LIST_APARTMENT: {
        const BaseListApartmentPage = require(`../domains/${domainFolder}/BaseListApartmentPage`).default;
        const page = new BaseListApartmentPage(url, htmlCode);
        page.on(Event.BaseListApartmentPage.ListApartmentURL, this._handleExtractedURL);
        page.process();
        break;
      }
      case URLType.PAGINATED_LIST_APARTMENT: {
        const ListApartmentPage = require(`../domains/${domainFolder}/ListApartmentPage`).default;
        const page = new ListApartmentPage(url, htmlCode);
        page.on(Event.ListApartmentPage.ApartmentURL, this._handleExtractedURL);
        page.process();
        break;
      }
      case URLType.ITEM_APARTMENT: {
        const ApartmentPage = require(`../domains/${domainFolder}/ApartmentPage`).default;
        const page = new ApartmentPage(url, htmlCode);
        page.on(Event.ApartmentPage.Apartment, this._handleApartment);
        page.process();
        break;
      }
    }
  }

  _handleExtractedURL(extractedURL) {
    this._urlFrontier.addUrl(extractedURL);
  }

  _handleApartment(apartment) {
    let newApartment = {};
    this._apartmentProperties.forEach((key) => {
      let property = ApartmentProperty[key];
      newApartment[property] = apartment[property];
    });
    ApartmentDBService.addApartment(newApartment);
  }
}

export default Extracter;
