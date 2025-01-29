'use strict';

describe('Service: observationphyto', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var observationphyto;
  beforeEach(inject(function (_observationphyto_) {
    observationphyto = _observationphyto_;
  }));

  it('should do something', function () {
    expect(!!observationphyto).toBe(true);
  });

});
