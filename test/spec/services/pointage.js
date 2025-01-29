'use strict';

describe('Service: pointage', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var pointage;
  beforeEach(inject(function (_pointage_) {
    pointage = _pointage_;
  }));

  it('should do something', function () {
    expect(!!pointage).toBe(true);
  });

});
