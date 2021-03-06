/**
 * Sample service
 */

// ------------------------------------
// Exports
// ------------------------------------

export default {
  testMethod
};


// ------------------------------------
// Public
// ------------------------------------

/**
 * Test method
 * @returns {{success: Boolean}} the test result
 */
function testMethod() {
  return Promise.resolve({success: true});
}
