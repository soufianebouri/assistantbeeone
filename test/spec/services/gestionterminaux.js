'use strict';

describe('Service: gestionterminaux', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var gestionterminaux;
  beforeEach(inject(function (_gestionterminaux_) {
    gestionterminaux = _gestionterminaux_;
  }));

  it('should do something', function () {
    expect(!!gestionterminaux).toBe(true);
  });

});
