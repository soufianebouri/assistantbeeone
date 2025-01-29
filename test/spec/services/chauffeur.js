'use strict';

describe('Service: Chauffeur', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var Chauffeur;
  beforeEach(inject(function (_Chauffeur_) {
    Chauffeur = _Chauffeur_;
  }));

  it('should do something', function () {
    expect(!!Chauffeur).toBe(true);
  });

});
