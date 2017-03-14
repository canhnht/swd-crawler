/**
 * Contains all application endpoints
 */

import TestController from './controllers/TestController';
import CrawlerController from './controllers/CrawlerController';
import ApartmentController from './controllers/ApartmentController';

export default {
  '/test': {
    get: {
      method: TestController.testMethod,
      public: true
    },
  },
  '/crawler/start': {
    post: {
      method: CrawlerController.startCrawler,
      public: true
    }
  },
  '/crawler/stop': {
    post: {
      method: CrawlerController.stopCrawler,
      public: true
    }
  },
  '/crawler/config': {
    post: {
      method: CrawlerController.saveConfig,
      public: true
    },
    get: {
      method: CrawlerController.getConfig,
      public: true
    }
  },
  '/apartments': {
    get: {
      method: ApartmentController.getApartments,
      public: true
    }
  }
};
