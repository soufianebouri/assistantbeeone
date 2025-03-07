'use strict';

describe('Service: calibre', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var calibre;
  beforeEach(inject(function (_calibre_) {
    calibre = _calibre_;
  }));

  it('should do something', function () {
    expect(!!calibre).toBe(true);
  });

});
