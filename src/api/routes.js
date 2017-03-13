/**
 * Contains all application endpoints
 */

import TestController from './controllers/TestController';
import CrawlerController from './controllers/CrawlerController';

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
    }
  }
};
