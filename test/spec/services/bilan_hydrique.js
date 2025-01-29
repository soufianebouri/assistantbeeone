'use strict';

describe('Service: bilanHydrique', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var bilanHydrique;
  beforeEach(inject(function (_bilanHydrique_) {
    bilanHydrique = _bilanHydrique_;
  }));

  it('should do something', function () {
    expect(!!bilanHydrique).toBe(true);
  });

});
