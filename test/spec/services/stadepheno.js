'use strict';

describe('Service: StadePheno', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var StadePheno;
  beforeEach(inject(function (_StadePheno_) {
    StadePheno = _StadePheno_;
  }));

  it('should do something', function () {
    expect(!!StadePheno).toBe(true);
  });

});
