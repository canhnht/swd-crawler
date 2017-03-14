import URL from '../../../common/models/URL';
import URLType from '../../../common/models/URLType';
import {Domain} from '../../../common/models/Domain';


const SeedURLs = [
  // new URL(Domain.NhaDat24h,
  //   'http://nhadat24h.net/ban-chung-cu-ha-noi-s295459/',
  //   URLType.BASE_LIST_APARTMENT),
  new URL(Domain.NhaDat24h,
    'http://nhadat24h.net/cho-thue-chung-cu-ha-noi-s299405/',
    URLType.BASE_LIST_APARTMENT)
];

export default SeedURLs;
