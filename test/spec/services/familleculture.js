'use strict';

describe('Service: familleculture', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var familleculture;
  beforeEach(inject(function (_familleculture_) {
    familleculture = _familleculture_;
  }));

  it('should do something', function () {
    expect(!!familleculture).toBe(true);
  });

});
