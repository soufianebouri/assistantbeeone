'use strict';

describe('Filter: ifEmpty', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var ifEmpty;
  beforeEach(inject(function ($filter) {
    ifEmpty = $filter('ifEmpty');
  }));

  it('should return the input prefixed with "ifEmpty filter:"', function () {
    var text = 'angularjs';
    expect(ifEmpty(text)).toBe('ifEmpty filter: ' + text);
  });

});
