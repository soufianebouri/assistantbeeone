'use strict';

describe('Service: comptagedesravageurs', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var comptagedesravageurs;
  beforeEach(inject(function (_comptagedesravageurs_) {
    comptagedesravageurs = _comptagedesravageurs_;
  }));

  it('should do something', function () {
    expect(!!comptagedesravageurs).toBe(true);
  });

});
