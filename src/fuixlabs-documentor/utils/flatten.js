import pkg from 'flatley';
import lodashPkg from 'lodash';

const {flatten} = pkg;
const {cloneDeep} = lodashPkg;

const hasPeriodInKey = (key) => {
  if (key.indexOf(".") >= 0) {
    throw new Error("Key names must not have . in them");
  }
  return false;
};

const filters = [{ test: hasPeriodInKey }];

/**
 * Calls external flatten library but ensures that global filters are always applied
 * @param data
 * @param options
 */
export const _flatten = (data, options) => {
  const newOptions = options ? cloneDeep(options) : {};
  if (newOptions.coercion) {
    newOptions.coercion.push(...filters);
  } else {
    newOptions.coercion = filters;
  }
  return flatten(data, newOptions);
};
