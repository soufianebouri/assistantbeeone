'use strict';

describe('Service: FermesProfil', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var FermesProfil;
  beforeEach(inject(function (_FermesProfil_) {
    FermesProfil = _FermesProfil_;
  }));

  it('should do something', function () {
    expect(!!FermesProfil).toBe(true);
  });

});
