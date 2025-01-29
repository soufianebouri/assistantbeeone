'use strict';

describe('Service: LieuElimination', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var LieuElimination;
  beforeEach(inject(function (_LieuElimination_) {
    LieuElimination = _LieuElimination_;
  }));

  it('should do something', function () {
    expect(!!LieuElimination).toBe(true);
  });

});
