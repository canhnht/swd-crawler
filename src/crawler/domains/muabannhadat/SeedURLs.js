import URL from '../../../common/models/URL';
import URLType from '../../../common/models/URLType';
import {Domain} from '../../../common/models/Domain';


const SeedURLs = [
  // new URL(Domain.MuaBanNhaDat,
  //   'http://www.muabannhadat.vn/can-ho-cho-thue-3519',
  //   URLType.PAGINATED_LIST_APARTMENT),
  new URL(Domain.MuaBanNhaDat,
    'http://www.muabannhadat.vn/can-ho-ban-3514',
    URLType.PAGINATED_LIST_APARTMENT)
];

export default SeedURLs;
