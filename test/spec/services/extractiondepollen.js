'use strict';

describe('Service: extractiondepollen', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var extractiondepollen;
  beforeEach(inject(function (_extractiondepollen_) {
    extractiondepollen = _extractiondepollen_;
  }));

  it('should do something', function () {
    expect(!!extractiondepollen).toBe(true);
  });

});
