'use strict';

describe('Service: composantesRendement', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var composantesRendement;
  beforeEach(inject(function (_composantesRendement_) {
    composantesRendement = _composantesRendement_;
  }));

  it('should do something', function () {
    expect(!!composantesRendement).toBe(true);
  });

});
