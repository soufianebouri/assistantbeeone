'use strict';

describe('Service: vente', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var vente;
  beforeEach(inject(function (_vente_) {
    vente = _vente_;
  }));

  it('should do something', function () {
    expect(!!vente).toBe(true);
  });

});
