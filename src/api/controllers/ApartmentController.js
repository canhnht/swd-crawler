import HTTPError from 'http-errors';
import ApartmentDBService from '../../common/ApartmentDBService';
import MainDBService from '../../common/MainDBService';
import {ApartmentProperty} from '../../common/models/ApartmentInfo';


// ------------------------------------
// Exports
// ------------------------------------

export default {
  getApartments
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
      return ApartmentDBService.getApartments(searchQuery, offset, limit);
    });
  }).then((docs) => {
    res.json(docs);
  });
}
