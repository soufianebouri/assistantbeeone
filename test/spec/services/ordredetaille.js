'use strict';

describe('Service: ordredetaille', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var ordredetaille;
  beforeEach(inject(function (_ordredetaille_) {
    ordredetaille = _ordredetaille_;
  }));

  it('should do something', function () {
    expect(!!ordredetaille).toBe(true);
  });

});
