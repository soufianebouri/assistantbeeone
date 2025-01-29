'use strict';

describe('Service: parcellecultural', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var parcellecultural;
  beforeEach(inject(function (_parcellecultural_) {
    parcellecultural = _parcellecultural_;
  }));

  it('should do something', function () {
    expect(!!parcellecultural).toBe(true);
  });

});
