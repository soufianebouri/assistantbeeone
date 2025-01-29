'use strict';

describe('Service: parametragestockage', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var parametragestockage;
  beforeEach(inject(function (_parametragestockage_) {
    parametragestockage = _parametragestockage_;
  }));

  it('should do something', function () {
    expect(!!parametragestockage).toBe(true);
  });

});
