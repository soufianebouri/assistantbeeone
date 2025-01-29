'use strict';

describe('Service: IntensiteFleur', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var IntensiteFleur;
  beforeEach(inject(function (_IntensiteFleur_) {
    IntensiteFleur = _IntensiteFleur_;
  }));

  it('should do something', function () {
    expect(!!IntensiteFleur).toBe(true);
  });

});
