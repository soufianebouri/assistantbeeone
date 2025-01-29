'use strict';

describe('Service: bac', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var bac;
  beforeEach(inject(function (_bac_) {
    bac = _bac_;
  }));

  it('should do something', function () {
    expect(!!bac).toBe(true);
  });

});
