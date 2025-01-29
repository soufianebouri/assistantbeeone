'use strict';

describe('Service: ordretraitementphytosanitaire', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var ordretraitementphytosanitaire;
  beforeEach(inject(function (_ordretraitementphytosanitaire_) {
    ordretraitementphytosanitaire = _ordretraitementphytosanitaire_;
  }));

  it('should do something', function () {
    expect(!!ordretraitementphytosanitaire).toBe(true);
  });

});
