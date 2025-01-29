'use strict';

describe('Filter: AsTwoDigit', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var AsTwoDigit;
  beforeEach(inject(function ($filter) {
    AsTwoDigit = $filter('AsTwoDigit');
  }));

  it('should return the input prefixed with "AsTwoDigit filter:"', function () {
    var text = 'angularjs';
    expect(AsTwoDigit(text)).toBe('AsTwoDigit filter: ' + text);
  });

});
