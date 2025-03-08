'use strict';

describe('Service: pesticide', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var pesticide;
  beforeEach(inject(function (_pesticide_) {
    pesticide = _pesticide_;
  }));

  it('should do something', function () {
    expect(!!pesticide).toBe(true);
  });

});
