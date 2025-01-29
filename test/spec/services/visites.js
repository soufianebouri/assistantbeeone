'use strict';

describe('Service: visites', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var visites;
  beforeEach(inject(function (_visites_) {
    visites = _visites_;
  }));

  it('should do something', function () {
    expect(!!visites).toBe(true);
  });

});
