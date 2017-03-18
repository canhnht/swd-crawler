import HTTPError from 'http-errors';
import ApartmentDBService from '../../common/ApartmentDBService';
import MainDBService from '../../common/MainDBService';
import {ApartmentProperty} from '../../common/models/ApartmentInfo';


// ------------------------------------
// Exports
// ------------------------------------

export default {
  getApartments,
  getAllApartments
};


// ------------------------------------
// Private
// ------------------------------------

const PAGE_SIZE = 10;


// ------------------------------------
// Public
// ------------------------------------

/*
Query params:
{
  page: 1,
  search: {
    Title: 'abc'
    Description: 'abc'
    ....
  }
}
*/
function getApartments(req, res, next) {
  let page = req.query.page || 1;
  let search = req.query;
  delete search.page;
  let offset = PAGE_SIZE * (page - 1);
  let limit = PAGE_SIZE;
  MainDBService.getCrawlerConfig().then((doc) => {
    let apartmentProperties = Object.keys(doc.apartmentInfo)
      .filter((key) => doc.apartmentInfo[key]);
    let searchQuery = {};
    apartmentProperties.forEach((key) => {
      let prop = ApartmentProperty[key];
      searchQuery[prop] = {
        $regex: new RegExp(search[prop] || '', 'i')
      };
    });
    return ApartmentDBService.connect().then(() => {
      let apartmentsPromise = ApartmentDBService.getApartments(searchQuery, offset, limit);
      let countPromise = ApartmentDBService.getNumberApartments();
      return Promise.all([apartmentsPromise, countPromise]);
    });
  }).then((result) => {
    let response = {
      apartments: result[0],
      currentPage: parseInt(page),
      numberOfPages: Math.ceil(result[1] / PAGE_SIZE)
    };
    res.json(response);
  });
}

function getAllApartments(req, res, next) {
  let search = req.query;
  MainDBService.getCrawlerConfig().then((doc) => {
    let apartmentProperties = Object.keys(doc.apartmentInfo)
      .filter((key) => doc.apartmentInfo[key]);
    let searchQuery = {};
    apartmentProperties.forEach((key) => {
      let prop = ApartmentProperty[key];
      searchQuery[prop] = {
        $regex: new RegExp(search[prop] || '', 'i')
      };
    });
    return ApartmentDBService.connect().then(() => {
      return ApartmentDBService.getAllApartments(searchQuery);
    });
  }).then((docs) => {
    res.json(docs);
  });
}
