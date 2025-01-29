'use strict';

describe('Service: controlephec', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var controlephec;
  beforeEach(inject(function (_controlephec_) {
    controlephec = _controlephec_;
  }));

  it('should do something', function () {
    expect(!!controlephec).toBe(true);
  });

});
