'use strict';

describe('Service: EvolutionCalibre', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var EvolutionCalibre;
  beforeEach(inject(function (_EvolutionCalibre_) {
    EvolutionCalibre = _EvolutionCalibre_;
  }));

  it('should do something', function () {
    expect(!!EvolutionCalibre).toBe(true);
  });

});
