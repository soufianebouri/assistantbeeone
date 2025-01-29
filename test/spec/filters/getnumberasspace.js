'use strict';

describe('Filter: getNumberAsSpace', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var getNumberAsSpace;
  beforeEach(inject(function ($filter) {
    getNumberAsSpace = $filter('getNumberAsSpace');
  }));

  it('should return the input prefixed with "getNumberAsSpace filter:"', function () {
    var text = 'angularjs';
    expect(getNumberAsSpace(text)).toBe('getNumberAsSpace filter: ' + text);
  });

});
