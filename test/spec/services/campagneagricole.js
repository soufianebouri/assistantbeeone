'use strict';

describe('Service: campagneagricole', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var campagneagricole;
  beforeEach(inject(function (_campagneagricole_) {
    campagneagricole = _campagneagricole_;
  }));

  it('should do something', function () {
    expect(!!campagneagricole).toBe(true);
  });

});
