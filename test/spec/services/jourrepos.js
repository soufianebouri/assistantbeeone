'use strict';

describe('Service: jourrepos', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var jourrepos;
  beforeEach(inject(function (_jourrepos_) {
    jourrepos = _jourrepos_;
  }));

  it('should do something', function () {
    expect(!!jourrepos).toBe(true);
  });

});
