(function (global) {
  'use strict';

  /**
   * A simple interface for working with query strings; encoding data to a query
   * string, and parsing existing query strings into objects.
   */
  class QueryString {
    /**
     * Parse the provided URL's query string into an object of keys & values.
     * Keys with multiple values are combined as an array.
     *
     * @param {string} url - The URL to parse for query string keys/values
     * @param {function} [decode] - The function used to decode keys & values
     * @return {object} The returned object contains decoded keys and values
     */
    static parse (url, options = { decode: decodeURIComponent }) {
      if (typeof url != 'string') {
        throw new TypeError('[QueryString.parse] "url" must be a string');
      }

      const queryStringIndex = url.indexOf('?');
      const doesNotHaveQueryString = queryStringIndex == -1;
      if (doesNotHaveQueryString) { return {}; }

      const hashIndex = url.includes('#') ? url.indexOf('#') : url.length;
      const queryString = url.slice((queryStringIndex + 1), hashIndex);
      const encodedPairs = queryString.split('&');

      return encodedPairs.reduce((memo, pair) => {
        const [encodedKey, encodedValue] = pair.split('=');
        const decodedKey = options.decode(encodedKey);
        const decodedValue = options.decode(encodedValue);

        const hasExistingEntry = has(memo, decodedKey);

        if (hasExistingEntry) {
          const existingValue = memo[decodedKey];
          const valueList = (
            Array.isArray(existingValue)
            ? existingValue
            : [existingValue]
          );
          valueList.push(decodedValue);
          memo[decodedKey] = valueList;
        } else {
          memo[decodedKey] = decodedValue;
        }

        return memo;
      }, {});
    }

    /**
     * Converts and encodes an object into a query string. Array values are
     * added as multiple entries in the query string.
     *
     * @param {object} parameters - The object to convert to a query string
     * @param {function} [encode] - The function used to encode keys & values
     * @return {string} Result includes a "?" character if there is >= one key
     */
    static stringify (parameters, options = { encode: encodeURIComponent }) {
      if (typeof parameters != 'object' && parameters != null) {
        throw new TypeError('[QueryString.stringify] "parameters" must be an object');
      }

      const keys = Object.keys(parameters);
      if (keys.length == 0) { return '' };

      const pairs = keys.map((key) => {
        const value = parameters[key];
        const encodedKey = options.encode(key);
        let pair;
        if (Array.isArray(value)) {
          const values = value.map(each => `${encodedKey}=${options.encode(each)}`);
          pair = values.join('&');
        } else {
          pair = `${encodedKey}=${options.encode(value)}`;
        }
        return pair;
      });

      return `?${pairs.join('&')}`;
    }
  }

  /**
   * @private
   * Helper shorthand for property checking
   *
   * @param {object} object
   * @param {string} key
   * @return {boolean}
   */
  const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

  if (typeof define == 'function' && define.amd) {
    define(function () { return QueryString; });
  } else if (typeof exports == 'object') {
    if (typeof module == 'object' && typeof module.exports == 'object') {
      exports = module.exports = QueryString;
    } else {
      exports.QueryString = QueryString;
    }
  } else {
    global.QueryString = QueryString;
  }
}(typeof window == 'undefined' ? this : window));
