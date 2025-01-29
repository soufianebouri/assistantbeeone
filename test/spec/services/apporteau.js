'use strict';

describe('Service: ApportEau', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var ApportEau;
  beforeEach(inject(function (_ApportEau_) {
    ApportEau = _ApportEau_;
  }));

  it('should do something', function () {
    expect(!!ApportEau).toBe(true);
  });

});
