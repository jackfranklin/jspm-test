const logResult = (result, indentLevel) => {
  const prefix = Array.from({ length: indentLevel }, () => '\t').join('');
  console.log(prefix, result.name, result.passedString());
  if (result.asyncError) {
    console.warn(prefix, result.asyncError.message, result.asyncError.stack);
  }
  result.assertions.forEach((a) => {
    if (a.passed) return;
    console.warn(prefix + '\t', a.error.stack);
  });
  result.nested.forEach((result) => logResult(result, indentLevel + 1));
};

const logResults = (results) => {
  results.forEach((r) => logResult(r, 0));
}

export { logResults };
