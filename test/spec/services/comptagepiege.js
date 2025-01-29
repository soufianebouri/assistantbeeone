'use strict';

describe('Service: ComptagePiege', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var ComptagePiege;
  beforeEach(inject(function (_ComptagePiege_) {
    ComptagePiege = _ComptagePiege_;
  }));

  it('should do something', function () {
    expect(!!ComptagePiege).toBe(true);
  });

});
