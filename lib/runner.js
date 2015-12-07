import { processAssertions } from './main';

import { renderResults } from './dom-render';
import { logResults } from './log-render';

export function runTestsOnFiles(files) {
  const promises = files.map((f) => System.import(f));
  Promise.all(promises).then(() => {
    return processAssertions();
  }).then((results) => {
    console.log('results', results);
    document.body.appendChild(renderResults(results));
    logResults(results);
  }).catch((e) => {
    console.error('Eror running tests', e);
  });
}

