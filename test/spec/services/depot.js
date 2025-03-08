'use strict';

describe('Service: depot', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var depot;
  beforeEach(inject(function (_depot_) {
    depot = _depot_;
  }));

  it('should do something', function () {
    expect(!!depot).toBe(true);
  });

});
