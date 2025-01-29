'use strict';

describe('Service: baremes', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var baremes;
  beforeEach(inject(function (_baremes_) {
    baremes = _baremes_;
  }));

  it('should do something', function () {
    expect(!!baremes).toBe(true);
  });

});
