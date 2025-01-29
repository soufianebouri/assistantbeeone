'use strict';

describe('Filter: getNumberAs', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var getNumberAs;
  beforeEach(inject(function ($filter) {
    getNumberAs = $filter('getNumberAs');
  }));

  it('should return the input prefixed with "getNumberAs filter:"', function () {
    var text = 'angularjs';
    expect(getNumberAs(text)).toBe('getNumberAs filter: ' + text);
  });

});
