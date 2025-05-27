'use strict';

describe('Service: sousparcelleParcelleculturale', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var sousparcelleParcelleculturale;
  beforeEach(inject(function (_sousparcelleParcelleculturale_) {
    sousparcelleParcelleculturale = _sousparcelleParcelleculturale_;
  }));

  it('should do something', function () {
    expect(!!sousparcelleParcelleculturale).toBe(true);
  });

});
