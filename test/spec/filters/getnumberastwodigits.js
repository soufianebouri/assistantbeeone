'use strict';

describe('Filter: getNumberAsTwoDIgits', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var getNumberAsTwoDIgits;
  beforeEach(inject(function ($filter) {
    getNumberAsTwoDIgits = $filter('getNumberAsTwoDIgits');
  }));

  it('should return the input prefixed with "getNumberAsTwoDIgits filter:"', function () {
    var text = 'angularjs';
    expect(getNumberAsTwoDIgits(text)).toBe('getNumberAsTwoDIgits filter: ' + text);
  });

});
