'use strict';

describe('Service: classifications', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var classifications;
  beforeEach(inject(function (_classifications_) {
    classifications = _classifications_;
  }));

  it('should do something', function () {
    expect(!!classifications).toBe(true);
  });

});
