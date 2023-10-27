import { saltData, _createDocument } from '../data';

// * Mock data init
const testingObject = {
  param1: 'value1',
  param2: 'value2',
};
const emptyTestingObject = {};

test('The saltData function should return valid format object', () => {
  const saltedData = saltData(testingObject);
  for (const i in saltedData) {
    let decayItems = saltedData[i].split(':');
    expect(typeof decayItems[1]).toBe('string');
    expect(typeof decayItems[0]).toBe('string');
  }
});

test('The saltData function should return empty object', () => {
  const saltedData = saltData(emptyTestingObject);
  expect(Object.keys(saltedData).length).toBe(0);
});

test('The _createDocument function should return object with data key', () => {
  const documentSchema = _createDocument(testingObject);
  expect(documentSchema.data).toBeDefined();
  const saltedData = documentSchema?.data;
  for (const i in saltedData) {
    let decayItems = saltedData[i].split(':');
    expect(typeof decayItems[1]).toBe('string');
    expect(typeof decayItems[0]).toBe('string');
  }
});
