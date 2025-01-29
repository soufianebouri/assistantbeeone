'use strict';

describe('Service: gestiondessocietes', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var gestiondessocietes;
  beforeEach(inject(function (_gestiondessocietes_) {
    gestiondessocietes = _gestiondessocietes_;
  }));

  it('should do something', function () {
    expect(!!gestiondessocietes).toBe(true);
  });

});
