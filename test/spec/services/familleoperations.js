'use strict';

describe('Service: familleoperations', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var familleoperations;
  beforeEach(inject(function (_familleoperations_) {
    familleoperations = _familleoperations_;
  }));

  it('should do something', function () {
    expect(!!familleoperations).toBe(true);
  });

});
