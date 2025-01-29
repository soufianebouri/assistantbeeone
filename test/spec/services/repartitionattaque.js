'use strict';

describe('Service: RepartitionAttaque', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var RepartitionAttaque;
  beforeEach(inject(function (_RepartitionAttaque_) {
    RepartitionAttaque = _RepartitionAttaque_;
  }));

  it('should do something', function () {
    expect(!!RepartitionAttaque).toBe(true);
  });

});
