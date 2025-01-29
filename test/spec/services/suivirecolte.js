'use strict';

describe('Service: suivirecolte', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var suivirecolte;
  beforeEach(inject(function (_suivirecolte_) {
    suivirecolte = _suivirecolte_;
  }));

  it('should do something', function () {
    expect(!!suivirecolte).toBe(true);
  });

});
