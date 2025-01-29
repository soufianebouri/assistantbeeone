'use strict';

describe('Service: Tbrendement', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var Tbrendement;
  beforeEach(inject(function (_Tbrendement_) {
    Tbrendement = _Tbrendement_;
  }));

  it('should do something', function () {
    expect(!!Tbrendement).toBe(true);
  });

});
