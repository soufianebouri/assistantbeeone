'use strict';

describe('Service: translatedwords', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var translatedwords;
  beforeEach(inject(function (_translatedwords_) {
    translatedwords = _translatedwords_;
  }));

  it('should do something', function () {
    expect(!!translatedwords).toBe(true);
  });

});
