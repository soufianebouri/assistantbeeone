'use strict';

describe('Service: comptagedesravageurmap', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var comptagedesravageurmap;
  beforeEach(inject(function (_comptagedesravageurmap_) {
    comptagedesravageurmap = _comptagedesravageurmap_;
  }));

  it('should do something', function () {
    expect(!!comptagedesravageurmap).toBe(true);
  });

});
