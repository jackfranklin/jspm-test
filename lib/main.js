import { makeDescribe } from './describe';

let describes = [];

const processAssertions = () => {
  let resultPromises = describes.map((d) => d.run());
  return Promise.all(resultPromises);
}

export {
  describes,
  processAssertions
}
