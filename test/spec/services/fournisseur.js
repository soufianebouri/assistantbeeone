'use strict';

describe('Service: Fournisseur', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var Fournisseur;
  beforeEach(inject(function (_Fournisseur_) {
    Fournisseur = _Fournisseur_;
  }));

  it('should do something', function () {
    expect(!!Fournisseur).toBe(true);
  });

});
