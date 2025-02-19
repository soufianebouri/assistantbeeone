'use strict';

describe('Service: compagne', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var compagne;
  beforeEach(inject(function (_compagne_) {
    compagne = _compagne_;
  }));

  it('should do something', function () {
    expect(!!compagne).toBe(true);
  });

});
