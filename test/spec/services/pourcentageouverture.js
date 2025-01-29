'use strict';

describe('Service: pourcentageOuverture', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var pourcentageOuverture;
  beforeEach(inject(function (_pourcentageOuverture_) {
    pourcentageOuverture = _pourcentageOuverture_;
  }));

  it('should do something', function () {
    expect(!!pourcentageOuverture).toBe(true);
  });

});
