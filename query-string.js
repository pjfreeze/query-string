/* QueryString
 * https://github.com/pjfreeze/query-string
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
      if (!(typeof url == 'string')) return console.error('[QueryString.parse] "url" must be a string');

      const parameters = {};
      if (!url.includes('?')) return parameters;

      const queryStringIndex = url.indexOf('?');
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
          const existingValuesList = Array.isArray(existingValue) ? existingValue : [existingValue];
          parameters[decodedKey] = existingValuesList.concat([decodedValue]);
        } else {
          parameters[decodedKey] = decodedValue;
        }

        return parameters;
      }, parameters);
    }

    /**
     * Converts and encodes an object into a query string. Array values are added as multiple
     * entries in the query string.
     * @param {object} parameters - The object to convert to a query string
     * @returns {string} The query string includes the "?" character if there is one or more pairs
     */
    static stringify(parameters) {
      if (!(typeof parameters == 'object')) return console.error('[QueryString.stringify] "parameters" must be an object');

      const pairs = Object.keys(parameters).map((key) => {
        const value = parameters[key];
        const encodedKey = encodeURIComponent(key);
        let pair = '';
        if (Array.isArray(value)) {
          const values = value.map(each => `${encodedKey}=${encodeURIComponent(each)}`);
          pair = values.join('&');
        } else {
          pair = `${encodedKey}=${encodeURIComponent(value)}`;
        }
        return pair;
      });

      return pairs.length > 0 ? `?${pairs.join('&')}` : '';
    }
  }

  // Export logic based on Scott Hamper's Cookies.js project
  // https://github.com/ScottHamper/Cookies/blob/1.2.3/src/cookies.js
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(function () { return QueryString; });
  } else if (typeof exports === 'object') {
    // Support Node.js specific `module.exports` (which can be a function)
    if (typeof module === 'object' && typeof module.exports === 'object') {
      exports = module.exports = QueryString;
    }
  } else {
    global.QueryString = QueryString;
  }
}(typeof window === 'undefined' ? this : window));
