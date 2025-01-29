'use strict';

describe('Service: AspectVegetal', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var AspectVegetal;
  beforeEach(inject(function (_AspectVegetal_) {
    AspectVegetal = _AspectVegetal_;
  }));

  it('should do something', function () {
    expect(!!AspectVegetal).toBe(true);
  });

});
