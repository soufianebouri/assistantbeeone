'use strict';

describe('Service: Profil', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var Profil;
  beforeEach(inject(function (_Profil_) {
    Profil = _Profil_;
  }));

  it('should do something', function () {
    expect(!!Profil).toBe(true);
  });

});
