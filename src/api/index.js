/**
 * The application entry point
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import domainMiddleware from 'express-domain-middleware';
import {errorHandler, notFoundHandler} from 'express-api-error-handler';
import config from 'config';
import routes from './routes';
import loadRoutes from '../common/loadRoutes';
import logger from '../common/logger';
import MainDBService from '../common/MainDBService';
import ApartmentDBService from '../common/ApartmentDBService';

class Api {
  constructor() {
    let app = express();
    app.set('port', config.get('PORT'));

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(domainMiddleware);

    const apiRouter = new express.Router();

    loadRoutes(apiRouter, routes);

    app.use('/api', apiRouter);

    app.use(errorHandler({
      log: ({err, req, body}) => {
        logger.error(err, `${body.status} ${req.method} ${req.url}`);
      },
    }));
    app.use(notFoundHandler({
      log: ({req}) => {
        logger.error(`404 ${req.method} ${req.url}`);
      },
    }));

    this.app = app;
  }

  start() {
    return new Promise((resolve, reject) => {
      this.app.listen(this.app.get('port'), (err) => {
        if (err) reject(err);
        else {
          logger.info(`Express server listening on port ${this.app.get('port')} in ${process.env.NODE_ENV} mode`);
          resolve();
        }
      });
    })
  }

  initDB() {
    return MainDBService.connect(config.get('CLEAR_DB'))
      .then(() => {
        console.log('Connect to MongoDB');
        return MainDBService.initConfigs();
      }).then(() => ApartmentDBService.connect())
        .then(() => {
          console.log('Init crawler config');
        });
  }

  run() {
    this.initDB().then(() => this.start());
  }
}

export default Api;
