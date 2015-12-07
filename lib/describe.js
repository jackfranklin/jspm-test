import { assertEqual, ok } from './assertions';
import { Assertion } from './assertion';
import isEqual from 'lodash.isequal';
import { expect } from 'chai';
import { describes } from './main';

let counter = 0;

const makeId = () => counter++;

const resetDom = () => document.body.innerHTML = '';

class Describe {
  constructor(name, fn) {
    this.id = makeId();
    this.name = name;
    this.fn = fn;
    this.nested = [];
    this.assertions = [];
    this.expectedCount = 0;
    this.ASYNC_TIMEOUT = 2000;
  }

  describe(name, fn) {
    const nested = makeDescribe(name, fn);
    this.nested.push(nested);
    return nested;
  }

  plan(num) {
    this.expectedCount = num;
  }

  passed() {
    if (this.asyncError) return false;

    if (this.assertions.length === 0) {
      // if this describe has no direct assertions
      // we say it passed if all its nested ones passed
      return this.nestedAllPass();
    } else {
      // however, if this has assertions
      // we say it's passed if they passed
      return this.assertionsAllPass();
    }
  }

  nestedAllPass() {
    return this.nested.every((d) => d.passed());
  }

  assertionsAllPass() {
    return this.assertions.every((a) => a.passed);
  }

  passedString() {
    if (this.assertions.length > 0) {
      let str = this.assertionsAllPass() ? 'Success!' : 'Fail!';
      if (!this.nestedAllPass()) {
        str += ' (A nested test failed)';
      }
      return str;
    } else {
      return this.nestedAllPass() ? 'Success!' : 'Fail!';
    }
  }

  runIteration() {
    this.fn.call(null, this);
    // need to run anything nested too
    const nestedPromises = this.nested.map((d) => d.run());
    return Promise.all(nestedPromises);
  }

  run() {
    resetDom();

    return this.runIteration().then(() => {
      if (this.expectedCount === 0) {
        // tests not async, so no need to worry about anything
        return this;
      }

      const timeoutError = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const e = new Error(`Async Timeout. Expected ${this.expectedCount} assertions but got ${this.assertions.length}. Update your t.plan call.`);
            reject(e);
          }, this.ASYNC_TIMEOUT);
        });
      }

      const waitForAsync = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (this.expectedCount === this.assertions.length) {
              resolve(this);
            } else {
              resolve(waitForAsync());
            }
          }, 10);
        });
      }

      return Promise.race([
        timeoutError(),
        waitForAsync()
      ]).catch((e) => {
        this.asyncError = e;
        return this;
      })
    });
  }

  hasMatchingAssertion(name, args) {
    return this.assertions.some((a) => {
      return a.name === name && isEqual(a.args, args);
    });
  }
}

const wrapAssertion = (name, assertionFn) => {
  Describe.prototype[name] = function(...args) {

    const assertion = new Assertion({ name, args, fn: assertionFn });
    assertion.run();

    this.assertions.push(assertion);
  }
}

wrapAssertion('equal', (x, y) => {
  expect(x).to.equal(y);
});

wrapAssertion('ok', (x) => {
  expect(x).to.be.ok;
});

wrapAssertion('deepEqual', (x, y) => {
  expect(x).to.deep.equal(y);
});

const makeDescribe = (name, fn) => {
  return new Describe(name, fn);
}

const describe = (name, fn) => {
  const desc = makeDescribe(name, fn);
  describes.push(desc);
  return desc;
}

export { makeDescribe, wrapAssertion, describe };

