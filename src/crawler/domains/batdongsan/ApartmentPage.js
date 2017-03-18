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
    return $('.pm-title h1').text().trim();
  }

  _extractDescription($) {
    return $('.pm-desc').html().trim();
  }

  _extractPrice($) {
    return $('.gia-title strong').eq(0).text().trim();
  }

  _extractCity($) {
    let address = $('.diadiem-title').text().trim();
    let parts = address.split('-');
    return parts[parts.length - 1].trim();
  }

  _extractDistrict($) {
    let address = $('.diadiem-title').text().trim();
    let parts = address.split('-');
    return parts[parts.length - 2].trim();
  }

  _extractAddress($) {
    let leftColumn = $('.left');
    let rightColumn = $('.right');
    let address = '';
    leftColumn.each((idx, node) => {
      if (idx >= 1) {
        let name = $(node).text().trim();
        if (name == 'Địa chỉ') {
          address = rightColumn.eq(idx - 1).text().trim();
        }
      }
    })
    return address;
  }

  _extractArea($) {
    return $('.gia-title strong').eq(1).text().trim();
  }

  _extractDirection($) {
    return '';
  }

  _extractNumberOfBedrooms($) {
    return '';
  }

  _extractNumberOfBathrooms($) {
    return '';
  }

  _extractProject($) {
    return $('.diadiem-title a').text().trim();
  }

  _extractFloor($) {
    return '';
  }

  _extractUtilities($) {
    return '';
  }

  _extractEnvironment($) {
    return '';
  }

  _extractImages($) {
    let images = [];
    $('#thumbs img').each((idx, elem) => {
      let imageLink = this._getFullLink($(elem).attr('src'));
      images.push(imageLink);
    });
    return images;
  }

  _getFullLink(link) {
    let imageLink = '';
    if (link.startsWith('http'))
      imageLink = link;
    else imageLink = `${DomainName[this._baseUrl.domain]}${link}`;
    return imageLink.replace('200x200', '745x510');
  }
}

export default ApartmentPage;
