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

export const DateRegrex: RegExp =
  /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;

export const DateErrorValidationMessage: string =
  'must follow with dd/mm/yyyy format';

// This regrex is flowwing RFC 5322 standard email
export const EmailRegrex: RegExp =
  /^(?:(?:[a-zA-Z0-9](?:[.!#$%&'*+/=?^_`{|}~-]?[a-zA-Z0-9]){0,63})|(?:"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f]){0,63}"))@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,23}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\]))$/;

export const EmailErrorValidationMessage: string =
  'email must follow with RFC 5322 standard';
