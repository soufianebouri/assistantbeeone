'use strict';

describe('Service: engrais', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var engrais;
  beforeEach(inject(function (_engrais_) {
    engrais = _engrais_;
  }));

  it('should do something', function () {
    expect(!!engrais).toBe(true);
  });

});
