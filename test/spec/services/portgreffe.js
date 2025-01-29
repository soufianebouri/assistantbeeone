'use strict';

describe('Service: portGreffe', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var portGreffe;
  beforeEach(inject(function (_portGreffe_) {
    portGreffe = _portGreffe_;
  }));

  it('should do something', function () {
    expect(!!portGreffe).toBe(true);
  });

});
