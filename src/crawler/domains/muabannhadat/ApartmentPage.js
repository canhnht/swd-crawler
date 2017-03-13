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
    return $('.navi-title').text().trim();
  }

  _extractDescription($) {
    return $('#Description').html().trim();
  }

  _extractPrice($) {
    return $('#MainContent_ctlDetailBox_lblPrice.price').text().trim();
  }

  _extractCity($) {
    return $('#MainContent_ctlDetailBox_lblCity').text().trim();
  }

  _extractDistrict($) {
    return $('#MainContent_ctlDetailBox_lblDistrict').text().trim();
  }

  _extractAddress($) {
    let street = $('#MainContent_ctlDetailBox_lblStreet').text().trim();
    let ward = $('#MainContent_ctlDetailBox_lblWard').text().trim();
    return `${street}, ${ward}`;
  }

  _extractArea($) {
    return $('#MainContent_ctlDetailBox_lblSurface').text().trim();
  }

  _extractDirection($) {
    return $('#MainContent_ctlDetailBox_lblFengShuiDirection').text().trim();
  }

  _extractNumberOfBedrooms($) {
    return $('#MainContent_ctlDetailBox_lblBedRoom').text().trim();
  }

  _extractNumberOfBathrooms($) {
    return $('#MainContent_ctlDetailBox_lblBathRoom').text().trim();
  }

  _extractProject($) {
    return $('#MainContent_ctlDetailBox_lblProject').text().trim();
  }

  _extractFloor($) {
    return $('#MainContent_ctlDetailBox_lblFloor').text().trim();
  }

  _extractUtilities($) {
    return $('#MainContent_ctlDetailBox_lblUtility').html().trim();
  }

  _extractEnvironment($) {
    return $('#MainContent_ctlDetailBox_lblEnvironment').html().trim();
  }

  _extractImages($) {
    let images = [];
    $('.swipebox img').each((idx, elem) => {
      images.push($(elem).attr('src'));
    });
    return images;
  }
}

export default ApartmentPage;
