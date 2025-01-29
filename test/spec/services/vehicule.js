'use strict';

describe('Service: Vehicule', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var Vehicule;
  beforeEach(inject(function (_Vehicule_) {
    Vehicule = _Vehicule_;
  }));

  it('should do something', function () {
    expect(!!Vehicule).toBe(true);
  });

});
