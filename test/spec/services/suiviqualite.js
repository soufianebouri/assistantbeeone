'use strict';

describe('Service: suiviqualite', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var suiviqualite;
  beforeEach(inject(function (_suiviqualite_) {
    suiviqualite = _suiviqualite_;
  }));

  it('should do something', function () {
    expect(!!suiviqualite).toBe(true);
  });

});
