'use strict';

describe('Service: Produit', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var Produit;
  beforeEach(inject(function (_Produit_) {
    Produit = _Produit_;
  }));

  it('should do something', function () {
    expect(!!Produit).toBe(true);
  });

});
