'use strict';

describe('Service: NiveauConformite', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var NiveauConformite;
  beforeEach(inject(function (_NiveauConformite_) {
    NiveauConformite = _NiveauConformite_;
  }));

  it('should do something', function () {
    expect(!!NiveauConformite).toBe(true);
  });

});
