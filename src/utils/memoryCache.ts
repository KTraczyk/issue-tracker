import { Config } from '../config';

const cache: Record<string, Record<string, unknown>> = {
  [Config.ISSUES_COLLECTION_KEY]: {},
};

function getValue(collection: string, id: string) {
  return cache[collection][id];
}

function getAllValues(collection: string) {
  return Array.from(Object.values(cache[collection]));
}

function setValue(collection: string, id: string, value: unknown) {
  cache[collection][id] = value;
  return value;
}

function removeValue(collection: string, id: string) {
  delete cache[collection][id];
}

const MemoryCache = {
  getValue,
  getAllValues,
  setValue,
  removeValue,
};

export { MemoryCache };
