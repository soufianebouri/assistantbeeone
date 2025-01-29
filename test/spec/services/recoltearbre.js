'use strict';

describe('Service: recolteArbre', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var recolteArbre;
  beforeEach(inject(function (_recolteArbre_) {
    recolteArbre = _recolteArbre_;
  }));

  it('should do something', function () {
    expect(!!recolteArbre).toBe(true);
  });

});
