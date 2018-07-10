/* QueryString
 * https://github.com/pjfreeze/query-string
 *
 * This is free and unencumbered software released into the public domain.
 */
(function (global) {
  'use strict';

  /**
   * A simple interface for working with query strings; encoding data to a query string, and
   * parsing existing query strings into objects.
   */
  class QueryString {
    /**
     * Parse the provided URL's query string into an object of keys & values. Keys with multiple
     * values are converted to an array.
     * @param {string} url - The URL to parse for query string keys/values
     * @returns {object} The returned object contains properties with decoded keys and values
     */
    static parse(url) {
      if (typeof url != 'string') {
        throw new TypeError('[QueryString.parse] "url" must be a string');
      }

      const queryStringIndex = url.indexOf('?');
      const doesNotHaveQueryString = queryStringIndex == -1;
      if (doesNotHaveQueryString) return {};

      const hashIndex = url.includes('#') ? url.indexOf('#') : url.length;
      const queryString = url.slice(queryStringIndex + 1, hashIndex);
      const encodedPairs = queryString.split('&');

      return encodedPairs.reduce((parameters, pair) => {
        const [encodedKey, encodedValue] = pair.split('=');
        const decodedKey = decodeURIComponent(encodedKey);
        const decodedValue = decodeURIComponent(encodedValue);

        const hasExistingEntry = Object.prototype.hasOwnProperty.call(parameters, decodedKey);

        if (hasExistingEntry) {
          const existingValue = parameters[decodedKey];
          const valueList = Array.isArray(existingValue) ? existingValue : [existingValue];
          valueList.push(decodedValue);
          parameters[decodedKey] = valueList;
        } else {
          parameters[decodedKey] = decodedValue;
        }

        return parameters;
      }, {});
    }

    /**
     * Converts and encodes an object into a query string. Array values are added as multiple
     * entries in the query string.
     * @param {object} parameters - The object to convert to a query string
     * @returns {string} The query string includes the "?" character if there is one or more pairs
     */
    static stringify(parameters) {
      if (typeof parameters != 'object' && parameters != null) {
        throw new TypeError('[QueryString.stringify] "parameters" must be an object');
      }

      const keys = Object.keys(parameters);
      if (keys.length == 0) return '';

      const pairs = keys.map((key) => {
        const value = parameters[key];
        const encodedKey = encodeURIComponent(key);
        let pair;
        if (Array.isArray(value)) {
          const values = value.map(each => `${encodedKey}=${encodeURIComponent(each)}`);
          pair = values.join('&');
        } else {
          pair = `${encodedKey}=${encodeURIComponent(value)}`;
        }
        return pair;
      });

      return `?${pairs.join('&')}`;
    }
  }

  // Export logic based on Scott Hamper's Cookies.js project
  // https://github.com/ScottHamper/Cookies/blob/1.2.3/src/cookies.js
  if (typeof define == 'function' && define.amd) {
    define(function () { return QueryString; });
  } else if (typeof exports == 'object') {
    if (typeof module == 'object' && typeof module.exports == 'object') {
      exports = module.exports = QueryString;
    }
  } else {
    global.QueryString = QueryString;
  }
}(typeof window == 'undefined' ? this : window));
