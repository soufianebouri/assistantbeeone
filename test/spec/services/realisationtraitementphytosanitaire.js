'use strict';

describe('Service: realisationtraitementphytosanitaire', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var realisationtraitementphytosanitaire;
  beforeEach(inject(function (_realisationtraitementphytosanitaire_) {
    realisationtraitementphytosanitaire = _realisationtraitementphytosanitaire_;
  }));

  it('should do something', function () {
    expect(!!realisationtraitementphytosanitaire).toBe(true);
  });

});
