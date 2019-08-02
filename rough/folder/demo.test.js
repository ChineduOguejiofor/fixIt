const chai = require('chai');

const { expect } = chai;

const demo = require('./demo');

describe('demo', () => {
  context('add', () => {
    it('should add two numbers', () => {
      expect(demo.add(1, 2)).to.equal(3);
    });
  });
});
