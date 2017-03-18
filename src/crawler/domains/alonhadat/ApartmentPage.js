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
    return $('.title h1').text().trim();
  }

  _extractDescription($) {
    return $('.detail').html().trim();
  }

  _extractPrice($) {
    return $('.price .value').text().trim();
  }

  _extractCity($) {
    let address = $('.add .value').text().trim();
    let parts = address.split(',');
    return parts[parts.length - 1].trim();
  }

  _extractDistrict($) {
    let address = $('.add .value').text().trim();
    let parts = address.split(',');
    return parts[parts.length - 2].trim();
  }

  _extractAddress($) {
    return $('.add .value').text().trim();
  }

  _extractArea($) {
    return $('.square .value').text().trim();
  }

  _extractDirection($) {
    let found = false;
    let direction = '';
    $('.infor td').each((idx, elem) => {
      if (found) {
        found = false;
        direction = $(elem).text().trim();
      } else
        if ($(elem).text().trim() === 'Hướng') found = true;
    });
    return direction;
  }

  _extractNumberOfBedrooms($) {
    let found = false;
    let numberOfBedrooms = '';
    $('.infor td').each((idx, elem) => {
      if (found) {
        found = false;
        numberOfBedrooms = $(elem).text().trim();
      } else
        if ($(elem).text().trim() === 'Số phòng ngủ') found = true;
    });
    return numberOfBedrooms;
  }

  _extractNumberOfBathrooms($) {
    return '';
  }

  _extractProject($) {
    return $('.project a').text().trim();
  }

  _extractFloor($) {
    let found = false;
    let floor = '';
    $('.infor td').each((idx, elem) => {
      if (found) {
        found = false;
        floor = $(elem).text().trim();
      } else
        if ($(elem).text().trim() === 'Số lầu') found = true;
    });
    return floor;
  }

  _extractUtilities($) {
    return '';
  }

  _extractEnvironment($) {
    return '';
  }

  _extractImages($) {
    let images = [];
    $('.image-list .limage').each((idx, elem) => {
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
