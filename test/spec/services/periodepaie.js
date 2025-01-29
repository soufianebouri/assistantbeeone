'use strict';

describe('Service: periodepaie', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var periodepaie;
  beforeEach(inject(function (_periodepaie_) {
    periodepaie = _periodepaie_;
  }));

  it('should do something', function () {
    expect(!!periodepaie).toBe(true);
  });

});
