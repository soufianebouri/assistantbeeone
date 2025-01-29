'use strict';

describe('Service: recoltepollen', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var recoltepollen;
  beforeEach(inject(function (_recoltepollen_) {
    recoltepollen = _recoltepollen_;
  }));

  it('should do something', function () {
    expect(!!recoltepollen).toBe(true);
  });

});
