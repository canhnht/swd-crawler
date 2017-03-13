/**
 * Sample controller
 */
import TestService from '../services/TestService';

export default {
  testMethod
};

/**
 * Get test
 * @param {Object} req
 * @param {Object} res
 */
function testMethod(req, res) {
  TestService.testMethod()
    .then((result) => {
      res.json(result);
    });
}
