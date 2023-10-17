/**
 * Curried function that takes (iteratee)(value),
 * if value is a collection then recurse into it
 * otherwise apply `iteratee` on the primitive value
 */
const recursivelyApply = (iteratee) => (value) => {
  const PRIMITIVE_TYPES = ["number", "string", "boolean"];

  if (PRIMITIVE_TYPES.includes(typeof value) || value === null) {
    return iteratee(value);
  }
  return deepMap(value, iteratee);
};

/**
 * Applies `iteratee` to all fields in objects, goes into arrays as well.
 * Refer to test for example
 */
const deepMap = (collection, iteratee = (arg) => arg) => {
  if (collection instanceof Array) {
    return collection.map(recursivelyApply(iteratee));
  }
  if (typeof collection === "object") {
    const mappedObject = {};
    for (const key in collection) {
      if (collection.hasOwnProperty(key)) {
        mappedObject[key] = recursivelyApply(iteratee)(collection[key]);
      }
    }
    return mappedObject;
  }
  return collection;
};

export { deepMap };
