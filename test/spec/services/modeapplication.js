'use strict';

describe('Service: ModeApplication', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var ModeApplication;
  beforeEach(inject(function (_ModeApplication_) {
    ModeApplication = _ModeApplication_;
  }));

  it('should do something', function () {
    expect(!!ModeApplication).toBe(true);
  });

});
