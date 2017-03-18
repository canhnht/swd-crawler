import URL from '../../../common/models/URL';
import URLType from '../../../common/models/URLType';
import {Domain} from '../../../common/models/Domain';


const SeedURLs = [
  new URL(Domain.ALoNhaDat,
    'http://alonhadat.com.vn/nha-dat/can-ban/can-ho-chung-cu.html',
    URLType.BASE_LIST_APARTMENT),
  new URL(Domain.ALoNhaDat,
    'http://alonhadat.com.vn/nha-dat/cho-thue/can-ho-chung-cu.html',
    URLType.BASE_LIST_APARTMENT)
];

export default SeedURLs;
