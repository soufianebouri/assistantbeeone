'use strict';

describe('Service: ParcellePhysique', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var ParcellePhysique;
  beforeEach(inject(function (_ParcellePhysique_) {
    ParcellePhysique = _ParcellePhysique_;
  }));

  it('should do something', function () {
    expect(!!ParcellePhysique).toBe(true);
  });

});
