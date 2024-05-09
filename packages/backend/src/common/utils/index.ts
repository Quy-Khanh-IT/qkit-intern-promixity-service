import * as argon2 from 'argon2';
import mongoose, { ObjectId } from 'mongoose';

export const hashString = async (str: string) => {
  return await argon2.hash(str);
};

export const verifyHash = async (hash: string, str: string) => {
  return await argon2.verify(hash, str);
};

export const transObjectIdToString = (id: ObjectId) => {
  return id.toString();
};

export const transStringToObjectId = (id: string) => {
  return new mongoose.Types.ObjectId(id);
};

export const buildQueryParams = (options: object) => {
  let queryString = '?';
  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      const value = options[key];
      // Encode the key and value
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      // Append to the query string
      queryString += `${encodedKey}=${encodedValue}&`;
    }
  }

  // Remove the trailing '&' if present
  queryString = queryString.replace(/&$/, '');
  return queryString;
};

export const validateRoad = (inputString, targetStrings) => {
  const normalizedInput = inputString.toLowerCase();

  const normalizedTargets = targetStrings.map((str) => str.toLowerCase());

  for (const target of normalizedTargets) {
    if (normalizedInput.includes(target)) {
      return true;
    }
  }
  return false;
};
