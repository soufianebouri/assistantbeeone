'use strict';

describe('Service: typeconduite', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var typeconduite;
  beforeEach(inject(function (_typeconduite_) {
    typeconduite = _typeconduite_;
  }));

  it('should do something', function () {
    expect(!!typeconduite).toBe(true);
  });

});
