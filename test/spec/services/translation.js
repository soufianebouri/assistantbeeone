'use strict';

describe('Service: translation', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var translation;
  beforeEach(inject(function (_translation_) {
    translation = _translation_;
  }));

  it('should do something', function () {
    expect(!!translation).toBe(true);
  });

});
