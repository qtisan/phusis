
import * as phusis from '..';

it('Is `utilities imported?`', () => {

  // from `utilities/conversion.js`
  expect(phusis.camelToHyphenate).toBeDefined();
  expect(phusis.camelToUnderscore).toBeDefined();
  expect(phusis.hyphenateToCamel).toBeDefined();
  expect(phusis.hyphenateToUnderscore).toBeDefined();
  expect(phusis.underscoreToCamel).toBeDefined();
  expect(phusis.underscoreToHyphenate).toBeDefined();
  expect(phusis.parseJSON).toBeDefined();
  expect(phusis.num2cn).toBeDefined();
  expect(phusis.num2en).toBeDefined();

  // from `utilities/crypto.js`
  expect(phusis.decodeByMap).toBeDefined();
  expect(phusis.encodeByMap).toBeDefined();
  expect(phusis.encrypt).toBeDefined();
  expect(phusis.decrypt).toBeDefined();
  expect(phusis.md5).toBeDefined();

  // from `utilities/factory.js`
  expect(phusis.genSerial).toBeDefined();

  // from `utilities/polyfill.js`
  expect(Array.prototype.toTree).toBeDefined();
  expect(Date.prototype.getStamp).toBeDefined();
  expect(Date.getCurrentStamp).toBeDefined();
  expect(String.prototype.isCnNewID).toBeDefined();
  expect(Error.prototype.wrap).toBeDefined();
  expect(Error.prototype.log).toBeDefined();

});