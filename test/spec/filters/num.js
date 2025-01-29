'use strict';

describe('Filter: num', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var num;
  beforeEach(inject(function ($filter) {
    num = $filter('num');
  }));

  it('should return the input prefixed with "num filter:"', function () {
    var text = 'angularjs';
    expect(num(text)).toBe('num filter: ' + text);
  });

});
