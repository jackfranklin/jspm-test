let counter = 0;
const makeId = () => counter++;

class Assertion {
  constructor({ name, args, fn }) {
    this.name = name;
    this.args = args;
    this.id = makeId();
    this.fn = fn;
    this.hasRun = false;
  }

  run() {
    if (this.hasRun) return;

    let passed = true;
    let error;

    try {
      this.fn(...this.args);
    } catch (e) {
      passed = false;
      error = e;
    } finally {
      this.hasRun = true;
      this.passed = passed;
      this.error = error;
    }
  }
}

export { Assertion }
