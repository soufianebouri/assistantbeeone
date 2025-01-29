'use strict';

describe('Filter: floatastwodigits', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var floatastwodigits;
  beforeEach(inject(function ($filter) {
    floatastwodigits = $filter('floatastwodigits');
  }));

  it('should return the input prefixed with "floatastwodigits filter:"', function () {
    var text = 'angularjs';
    expect(floatastwodigits(text)).toBe('floatastwodigits filter: ' + text);
  });

});
