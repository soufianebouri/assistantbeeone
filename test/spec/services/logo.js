'use strict';

describe('Service: logo', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var logo;
  beforeEach(inject(function (_logo_) {
    logo = _logo_;
  }));

  it('should do something', function () {
    expect(!!logo).toBe(true);
  });

});
