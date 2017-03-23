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
    const title = $('.dv-ct-detail h1');
    if (title && title.text())
      return title.text().trim();
    else return '';
  }

  _extractDescription($) {
    const desc = $('#ContentPlaceHolder2_divContent');
    if (desc && desc.html())
      return desc.html().trim();
    else return '';
  }

  _extractPrice($) {
    const price = $('#ContentPlaceHolder2_lbGiaTien');
    if (price && price.text())
      return price.text().trim();
    else return '';
  }

  _extractCity($) {
    const city = $('#ContentPlaceHolder2_lbTinhThanh');
    if (city && city.text())
      return city.text().trim();
    else return '';
  }

  _extractDistrict($) {
    const district = $('#ContentPlaceHolder2_lbDiaChi a');
    if (district && district.text())
      return district.text().trim();
    else return '';
  }

  _extractAddress($) {
    const address = $('#ContentPlaceHolder2_lbVitri h2 a');
    if (address && address.text())
      return address.text().trim();
    else return '';
  }

  _extractArea($) {
    const area = $('#ContentPlaceHolder2_lbDienTich');
    if (area && area.text())
      return area.text().trim();
    else return '';
  }

  _extractDirection($) {
    const direction = $('#ContentPlaceHolder2_lbHuong');
    if (direction && direction.text())
      return direction.text().trim();
    else return '';
  }

  _extractNumberOfBedrooms($) {
    return '';
  }

  _extractNumberOfBathrooms($) {
    return '';
  }

  _extractProject($) {
    const project = $('#ContentPlaceHolder2_lbLoaiBDS a');
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
    let environment = $('#near-by-place-detail');
    if (environment && environment.html())
      return environment.html().trim();
    else return '';
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
