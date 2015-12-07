const createResultUl = () => {
  const ul = document.createElement('ul');
  ul.classList.add('test-results');
  return ul;
}

const renderAssertions = (result) => {
  const wrap = document.createElement('ul');
  result.assertions.forEach((assertion) => {
    const assertionMessage = document.createElement('li');
    assertionMessage.classList.add('assertion-message');
    // if (assertion.error && assertion.error.stack) {
    //   const preStack = document.createElement('pre');
    //   preStack.classList.add('assertion-stack');
    //   const codeStack = document.createElement('code');
    //   codeStack.textContent = assertion.error.stack;
    //   preStack.appendChild(codeStack);
    //   wrap.appendChild(preStack);
    // }
  });
  return wrap;
}

const renderResult = (result) => {
  const li = document.createElement('li');
  const div = document.createElement('div');
  div.classList.add(
    'test-result',
    `test-${result.passed() ? 'success' : 'fail'}`
  );

  const innerContent = (() => {
    const span = document.createElement('span');
    span.classList.add('describe-title');
    if (result.passed()) {
      span.textContent = `Describe: ${result.name} passed!`;
    } else {
      span.textContent = `Describe: ${result.name} failed!`;
    }

    if (result.asyncError) {
      span.textContent += ' (Async test timed out)';
    }

    span.appendChild(renderAssertions(result));

    return span;
  })();

  div.appendChild(innerContent);

  if (result.nested.length > 0) {
    div.appendChild(renderResults(result.nested));
  }

  li.appendChild(div);

  return li;
}

const renderResults = (results) => {
  const listFrag = document.createDocumentFragment();

  const ul = createResultUl();

  results.map((r) => renderResult(r)).forEach((elem) => {
    listFrag.appendChild(elem);
  });

  ul.appendChild(listFrag);
  return ul;
}

export { renderResults };

