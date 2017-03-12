/**
 * Configure all libraries
 * Include this module as a main entry point
 */
import bluebird from 'bluebird';
import decorate from 'decorate-it';
import config from 'config';

require('babel-runtime/core-js/promise').default = bluebird;

decorate.configure({
  debug: config.VERBOSE_LOGGING,
});
