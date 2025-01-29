'use strict';

describe('Filter: dayname', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var dayname;
  beforeEach(inject(function ($filter) {
    dayname = $filter('dayname');
  }));

  it('should return the input prefixed with "dayname filter:"', function () {
    var text = 'angularjs';
    expect(dayname(text)).toBe('dayname filter: ' + text);
  });

});
