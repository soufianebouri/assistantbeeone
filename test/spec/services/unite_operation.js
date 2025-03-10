'use strict';

describe('Service: uniteOperation', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var uniteOperation;
  beforeEach(inject(function (_uniteOperation_) {
    uniteOperation = _uniteOperation_;
  }));

  it('should do something', function () {
    expect(!!uniteOperation).toBe(true);
  });

});
