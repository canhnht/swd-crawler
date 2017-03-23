import {EventEmitter} from 'events';
import cheerio from 'cheerio';
import Event from '../../../common/Event';
import {Domain, DomainName} from '../../../common/models/Domain';
import {ApartmentProperty} from '../../../common/models/ApartmentInfo';

class ApartmentPage extends EventEmitter {
  constructor(baseUrl, htmlCode) {
    super();
    this._baseUrl = baseUrl;
    this._htmlCode = htmlCode;
  }

  _newApartment() {
    let apartment = {};
    Object.keys(ApartmentProperty).forEach((key) => {
      apartment[ApartmentProperty[key]] = '';
    });
    return apartment;
  }

  process() {
    let $ = cheerio.load(this._htmlCode, { decodeEntities: false });
    let apartment = this._newApartment();
    apartment.Title = this._extractTitle($);
    apartment.Description = this._extractDescription($);
    apartment.Price = this._extractPrice($);
    apartment.Address = this._extractAddress($);
    apartment.Area = this._extractArea($);
    apartment.Direction = this._extractDirection($);
    apartment.NumberOfBedrooms = this._extractNumberOfBedrooms($);
    apartment.NumberOfBathrooms = this._extractNumberOfBathrooms($);
    apartment.Project = this._extractProject($);
    apartment.Floor = this._extractFloor($);
    apartment.Utilities = this._extractUtilities($);
    apartment.Environment = this._extractEnvironment($);
    apartment.City = this._extractCity($);
    apartment.District = this._extractDistrict($);
    apartment.Images = this._extractImages($);
    this.emit(Event.ApartmentPage.Apartment, apartment);
  }

  _extractTitle($) {
    const title = $('.navi-title');
    if (title && title.text())
      return title.text().trim();
    else return '';
  }

  _extractDescription($) {
    const desc = $('#Description');
    if (desc && desc.html())
      return desc.html().trim();
    else return '';
  }

  _extractPrice($) {
    const price = $('#MainContent_ctlDetailBox_lblPrice.price');
    if (price && price.text())
      return price.text().trim();
    else return '';
  }

  _extractCity($) {
    const city = $('#MainContent_ctlDetailBox_lblCity');
    if (city && city.text())
      return city.text().trim();
    else return '';
  }

  _extractDistrict($) {
    const district = $('#MainContent_ctlDetailBox_lblDistrict');
    if (district && district.text())
      return district.text().trim();
  }

  _extractAddress($) {
    let street = $('#MainContent_ctlDetailBox_lblStreet');
    if (street && street.text())
      street = street.text().trim();
    else street = '';

    let ward = $('#MainContent_ctlDetailBox_lblWard');
    if (ward && ward.text())
      ward = ward.text().trim();
    else ward = '';

    return `${street}, ${ward}`;
  }

  _extractArea($) {
    const area = $('#MainContent_ctlDetailBox_lblSurface');
    if (area && area.text())
      return area.text().trim();
    else return '';
  }

  _extractDirection($) {
    const direction = $('#MainContent_ctlDetailBox_lblFengShuiDirection');
    if (direction && direction.text())
      return direction.text().trim();
    else return '';
  }

  _extractNumberOfBedrooms($) {
    const numberOfBedrroms = $('#MainContent_ctlDetailBox_lblBedRoom');
    if (numberOfBedrroms && numberOfBedrroms.text())
      return numberOfBedrroms.text().trim();
    else return '';
  }

  _extractNumberOfBathrooms($) {
    const numberOfBathrooms = $('#MainContent_ctlDetailBox_lblBathRoom');
    if (numberOfBathrooms && numberOfBathrooms.text())
      return numberOfBathrooms.text().trim();
    else return '';
  }

  _extractProject($) {
    const project = $('#MainContent_ctlDetailBox_lblProject');
    if (project && project.text())
      return project.text().trim();
    else return '';
  }

  _extractFloor($) {
    const floor = $('#MainContent_ctlDetailBox_lblFloor');
    if (floor && floor.text())
      return floor.text().trim();
    else return '';
  }

  _extractUtilities($) {
    const utilities = $('#MainContent_ctlDetailBox_lblUtility');
    if (utilities && utilities.html())
      return utilities.html().trim();
    else return '';
  }

  _extractEnvironment($) {
    const environment = $('#MainContent_ctlDetailBox_lblEnvironment');
    if (environment && environment.html())
      return environment.html().trim();
    else return '';
  }

  _extractImages($) {
    let images = [];
    $('.swipebox img').each((idx, elem) => {
      let imageLink = this._getFullLink($(elem).attr('src'));
      images.push(imageLink);
    });
    return images;
  }

  _getFullLink(link) {
    if (link.startsWith('http'))
      return link;
    return `${DomainName[this._baseUrl.domain]}${link}`;
  }
}

export default ApartmentPage;
