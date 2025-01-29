'use strict';

describe('Filter: trustAsResourceUrl', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var trustAsResourceUrl;
  beforeEach(inject(function ($filter) {
    trustAsResourceUrl = $filter('trustAsResourceUrl');
  }));

  it('should return the input prefixed with "trustAsResourceUrl filter:"', function () {
    var text = 'angularjs';
    expect(trustAsResourceUrl(text)).toBe('trustAsResourceUrl filter: ' + text);
  });

});
