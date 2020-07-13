// import chai from 'chai';
// import { describe, it } from 'mocha';
// import errMsg from '../server/routes/api/v1/util';
// describe('Test util module', () => {
//   describe('Test errMsg', () => {
//     it('should return a valid object with the err text', () => {
//       const text = 'I am glad';

//       const actualValue = errMsg(text);
//       const expectedValue = {
//         msg: text
//       };

//       chai.assert(actualValue).is.equal.to(expectedValue);
//     });
//   });
// });

// const chai = require('chai');
// const expect = chai.expect;

// const util = require('../server/routes/api/v1/util');

// describe('util', () => {
//   context('errorMessage', () => {
//     it('should return a value', () => {
//       expect(util.errorMsg('I am here').to.equal('I am here'));
//     });
//   });
// });

const assert = require('chai').assert;
// const app = require('../')
const util = require('../server/routes/api/v1/util');

describe('App', function() {
  it('app should return hello', function() {
    assert.equal(util.sayHello(), 'Hello');
  });
});

// describe('App', function() {
//   it('app should return hello', function() {
//     assert.equal(util.errorMsg('I return'),  errText: 'I return' );
//   });
// });
