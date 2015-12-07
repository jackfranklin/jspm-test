import { expect } from 'chai';

const assertEqual = (x, y) => {
  expect(x).to.equal(y);
}

const ok = (x) => {
  expect(x).to.be.ok;
}

export { assertEqual, ok };
