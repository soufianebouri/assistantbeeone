'use strict';

describe('Service: suividesstadesgc', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var suividesstadesgc;
  beforeEach(inject(function (_suividesstadesgc_) {
    suividesstadesgc = _suividesstadesgc_;
  }));

  it('should do something', function () {
    expect(!!suividesstadesgc).toBe(true);
  });

});
