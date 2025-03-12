'use strict';

describe('Service: profilProduction', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var profilProduction;
  beforeEach(inject(function (_profilProduction_) {
    profilProduction = _profilProduction_;
  }));

  it('should do something', function () {
    expect(!!profilProduction).toBe(true);
  });

});
