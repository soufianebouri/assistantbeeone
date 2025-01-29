'use strict';

describe('Service: Cible', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var Cible;
  beforeEach(inject(function (_Cible_) {
    Cible = _Cible_;
  }));

  it('should do something', function () {
    expect(!!Cible).toBe(true);
  });

});
