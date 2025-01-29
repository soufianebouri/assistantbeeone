'use strict';

describe('Filter: getNumberAsDigit', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var getNumberAsDigit;
  beforeEach(inject(function ($filter) {
    getNumberAsDigit = $filter('getNumberAsDigit');
  }));

  it('should return the input prefixed with "getNumberAsDigit filter:"', function () {
    var text = 'angularjs';
    expect(getNumberAsDigit(text)).toBe('getNumberAsDigit filter: ' + text);
  });

});
