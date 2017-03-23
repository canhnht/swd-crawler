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
    const title = $('.pm-title h1');
    if (title && title.text())
      return title.text().trim();
    else return '';
  }

  _extractDescription($) {
    const desc = $('.pm-desc');
    if (desc && desc.html())
      return desc.html().trim();
    else return '';
  }

  _extractPrice($) {
    const price = $('.gia-title strong');
    if (price && price.eq(0) && price.eq(0).text())
      return price.eq(0).text().trim();
    else return '';
  }

  _extractCity($) {
    let address = $('.diadiem-title').text().trim();
    let parts = address.split('-');
    if (parts.length > 0)
      return parts[parts.length - 1].trim();
    else return '';
  }

  _extractDistrict($) {
    let address = $('.diadiem-title').text().trim();
    let parts = address.split('-');
    if (parts.length > 1)
      return parts[parts.length - 2].trim();
    else return '';
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
    const area = $('.gia-title strong');
    if (area && area.eq(1) && area.eq(1).text())
      return area.eq(1).text().trim();
    else return '';
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
    const project = $('.diadiem-title a');
    if (project && project.text())
      return project.text().trim();
    else return '';
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
