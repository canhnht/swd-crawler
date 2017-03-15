import URL from '../../../common/models/URL';
import URLType from '../../../common/models/URLType';
import {Domain} from '../../../common/models/Domain';


const SeedURLs = [
  new URL(Domain.BatDongSan,
    'http://batdongsan.com.vn/ban-can-ho-chung-cu',
    URLType.BASE_LIST_APARTMENT),
  new URL(Domain.BatDongSan,
    'http://batdongsan.com.vn/cho-thue-can-ho-chung-cu',
    URLType.BASE_LIST_APARTMENT)
];

export default SeedURLs;
