'use strict';

describe('Filter: integer', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var integer;
  beforeEach(inject(function ($filter) {
    integer = $filter('integer');
  }));

  it('should return the input prefixed with "integer filter:"', function () {
    var text = 'angularjs';
    expect(integer(text)).toBe('integer filter: ' + text);
  });

});
