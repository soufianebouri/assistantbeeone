'use strict';

describe('Service: eclaircissagedesregimes', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var eclaircissagedesregimes;
  beforeEach(inject(function (_eclaircissagedesregimes_) {
    eclaircissagedesregimes = _eclaircissagedesregimes_;
  }));

  it('should do something', function () {
    expect(!!eclaircissagedesregimes).toBe(true);
  });

});
