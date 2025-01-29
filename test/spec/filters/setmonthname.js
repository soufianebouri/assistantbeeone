'use strict';

describe('Filter: setMonthName', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var setMonthName;
  beforeEach(inject(function ($filter) {
    setMonthName = $filter('setMonthName');
  }));

  it('should return the input prefixed with "setMonthName filter:"', function () {
    var text = 'angularjs';
    expect(setMonthName(text)).toBe('setMonthName filter: ' + text);
  });

});
