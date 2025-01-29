'use strict';

describe('Filter: escapeObject', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var escapeObject;
  beforeEach(inject(function ($filter) {
    escapeObject = $filter('escapeObject');
  }));

  it('should return the input prefixed with "escapeObject filter:"', function () {
    var text = 'angularjs';
    expect(escapeObject(text)).toBe('escapeObject filter: ' + text);
  });

});
