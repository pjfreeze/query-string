const assert = require('assert');

const QueryString = require('./../query-string.js');

describe('QueryString#parse', () => {
  it('should return an empty object if the URL doesn\'t have a query string', () => {
    const result = QueryString.parse('http://example.com');
    assert(Object.keys(result).length == 0);
  });

  it('should trim the hash from the parsed query string if it exists', () => {
    const result = QueryString.parse('http://example.com?key=value#alphabet-soup');
    assert(Object.keys(result).length == 1);
    assert(result.key == 'value');
  });

  it('should convert query strings with duplicate keys to arrays', () => {
    const result = QueryString.parse('http://example.com?list=a&list=b&list=c');
    assert(Object.keys(result).length == 1);
    assert(Array.isArray(result.list));
    assert(result.list[0] == 'a');
    assert(result.list[2] == 'c');
    assert(result.list[2] == 'c');
  });
});

describe('QueryString#stringify', () => {
  it('should convert arrays to duplicate key entries', () => {
    const result = QueryString.stringify({ list: ['a', 'b', 'c'] });
    assert(result.includes('list=a&list=b&list=c'));
  });

  it('should encode both keys and values', () => {
    const result = QueryString.stringify({ special: 'a:1' });
    assert(result.includes(`special=${encodeURIComponent('a:1')}`));
  });

  it('should return an empty string if there were no "pairs"', () => {
    const result = QueryString.stringify({});
    assert(result == '');
  });

  it('should return a string with a "?" if there were any "pairs"', () => {
    const result = QueryString.stringify({ foo: 'bar' });
    assert(result.startsWith('?'));
  });
});
