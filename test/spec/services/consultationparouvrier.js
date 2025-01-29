'use strict';

describe('Service: consultationparouvrier', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var consultationparouvrier;
  beforeEach(inject(function (_consultationparouvrier_) {
    consultationparouvrier = _consultationparouvrier_;
  }));

  it('should do something', function () {
    expect(!!consultationparouvrier).toBe(true);
  });

});
