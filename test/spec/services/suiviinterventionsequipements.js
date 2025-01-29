'use strict';

describe('Service: suiviinterventionsequipements', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var suiviinterventionsequipements;
  beforeEach(inject(function (_suiviinterventionsequipements_) {
    suiviinterventionsequipements = _suiviinterventionsequipements_;
  }));

  it('should do something', function () {
    expect(!!suiviinterventionsequipements).toBe(true);
  });

});
