import Event from '../../common/Event';
import {ApartmentProperty} from '../../common/models/ApartmentInfo';
import ApartmentDBService from '../../common/ApartmentDBService';

class Extracter {
  constructor(httpFetcher) {
    this._httpFetcher = httpFetcher;
    this._handleApartmentPage = this._handleApartmentPage.bind(this);
    this._handleApartment = this._handleApartment.bind(this);
  }

  run(apartmentProperties) {
    this._apartmentProperties = apartmentProperties;
    this._httpFetcher.on(Event.HTTPFetcher.ApartmentPage, this._handleApartmentPage);
  }

  _handleApartmentPage(apartmentPage) {
    apartmentPage.on(Event.ApartmentPage.Apartment, this._handleApartment);
    apartmentPage.process();
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
