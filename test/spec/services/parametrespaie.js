'use strict';

describe('Service: parametrespaie', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var parametrespaie;
  beforeEach(inject(function (_parametrespaie_) {
    parametrespaie = _parametrespaie_;
  }));

  it('should do something', function () {
    expect(!!parametrespaie).toBe(true);
  });

});
