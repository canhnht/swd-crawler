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
    return $('.dv-ct-detail h1').text().trim();
  }

  _extractDescription($) {
    return $('#ContentPlaceHolder2_divContent').html().trim();
  }

  _extractPrice($) {
    return $('#ContentPlaceHolder2_lbGiaTien').text().trim();
  }

  _extractCity($) {
    return $('#ContentPlaceHolder2_lbTinhThanh').text().trim();
  }

  _extractDistrict($) {
    return $('#ContentPlaceHolder2_lbDiaChi a').text().trim();
  }

  _extractAddress($) {
    return $('#ContentPlaceHolder2_lbVitri h2 a').text().trim();
  }

  _extractArea($) {
    return $('#ContentPlaceHolder2_lbDienTich').text().trim();
  }

  _extractDirection($) {
    return $('#ContentPlaceHolder2_lbHuong').text().trim();
  }

  _extractNumberOfBedrooms($) {
    return '';
  }

  _extractNumberOfBathrooms($) {
    return '';
  }

  _extractProject($) {
    return $('#ContentPlaceHolder2_lbLoaiBDS a').text().trim();
  }

  _extractFloor($) {
    return '';
  }

  _extractUtilities($) {
    return '';
  }

  _extractEnvironment($) {
    let node = $('#near-by-place-detail');
    if (node && node.html()) {
      return node.trim();
    } else return '';
  }

  _extractImages($) {
    let images = [];
    $('.swipebox').each((idx, elem) => {
      let imageLink = this._getFullLink($(elem).attr('href'));
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
