'use strict';

describe('Service: coutparoperations', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var coutparoperations;
  beforeEach(inject(function (_coutparoperations_) {
    coutparoperations = _coutparoperations_;
  }));

  it('should do something', function () {
    expect(!!coutparoperations).toBe(true);
  });

});
