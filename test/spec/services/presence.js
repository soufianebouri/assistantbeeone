'use strict';

describe('Service: presence', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var presence;
  beforeEach(inject(function (_presence_) {
    presence = _presence_;
  }));

  it('should do something', function () {
    expect(!!presence).toBe(true);
  });

});
