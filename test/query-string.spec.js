'use strict';

const assert = require('assert');

const QueryString = require('./../query-string.js');


describe('QueryString#parse', () => {
  it('should return an empty object if the URL does not have a query string', () => {
    const result = QueryString.parse('http://example.com');
    assert.equal(Object.keys(result).length, 0);
  });

  it('should trim the hash from the parsed query string if it exists', () => {
    const result = QueryString.parse('http://example.com?key=value#alphabet-soup');
    assert.equal(Object.keys(result).length, 1);
    assert.equal(result.key, 'value');
  });

  it('should convert query strings with duplicate keys to arrays', () => {
    const result = QueryString.parse('http://example.com?list=a&list=b&list=c');
    assert.equal(Object.keys(result).length, 1);
    assert(Array.isArray(result.list));
    assert.equal(result.list[0], 'a');
    assert.equal(result.list[1], 'b');
    assert.equal(result.list[2], 'c');
  });
});

describe('QueryString#stringify', () => {
  it('should convert arrays to duplicate key entries', () => {
    const parameters = { list: ['a', 'b', 'c'] };
    const result = QueryString.stringify(parameters);
    assert(result.includes('list=a&list=b&list=c'));
  });

  it('should encode both keys and values', () => {
    const parameters = { special: 'a:1' };
    const result = QueryString.stringify(parameters);
    assert(result.includes(`special=${encodeURIComponent(parameters.special)}`));
  });

  it('should return an empty string if there were no "pairs"', () => {
    const parameters = {};
    const result = QueryString.stringify(parameters);
    assert.equal(result, '');
  });

  it('should return a string with a "?" if there was at least one key', () => {
    const parameters = { foo: 'bar' };
    const result = QueryString.stringify(parameters);
    assert(result.startsWith('?'));
  });
});
