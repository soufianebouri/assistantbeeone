'use strict';

describe('Filter: floatasNBRdigits', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var floatasNBRdigits;
  beforeEach(inject(function ($filter) {
    floatasNBRdigits = $filter('floatasNBRdigits');
  }));

  it('should return the input prefixed with "floatasNBRdigits filter:"', function () {
    var text = 'angularjs';
    expect(floatasNBRdigits(text)).toBe('floatasNBRdigits filter: ' + text);
  });

});
