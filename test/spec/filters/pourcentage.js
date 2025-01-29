'use strict';

describe('Filter: pourcentage', function () {

  // load the filter's module
  beforeEach(module('beeOneWebFrontApp'));

  // initialize a new instance of the filter before each test
  var pourcentage;
  beforeEach(inject(function ($filter) {
    pourcentage = $filter('pourcentage');
  }));

  it('should return the input prefixed with "pourcentage filter:"', function () {
    var text = 'angularjs';
    expect(pourcentage(text)).toBe('pourcentage filter: ' + text);
  });

});
