'use strict';

describe('Service: produitrendement', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var produitrendement;
  beforeEach(inject(function (_produitrendement_) {
    produitrendement = _produitrendement_;
  }));

  it('should do something', function () {
    expect(!!produitrendement).toBe(true);
  });

});
