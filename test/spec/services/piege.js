'use strict';

describe('Service: Piege', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var Piege;
  beforeEach(inject(function (_Piege_) {
    Piege = _Piege_;
  }));

  it('should do something', function () {
    expect(!!Piege).toBe(true);
  });

});
