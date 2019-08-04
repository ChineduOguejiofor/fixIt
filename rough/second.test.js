const chai = require('chai');

const { expect } = chai;

const secondDemo = require('./second');

describe('secondDemo', () => {
  context('add', () => {
    it('sendo number', () => {
      expect(secondDemo.add(1, 2)).to.equal(3);
    });
  });
});
