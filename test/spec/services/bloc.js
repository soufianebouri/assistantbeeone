'use strict';

describe('Service: bloc', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var bloc;
  beforeEach(inject(function (_bloc_) {
    bloc = _bloc_;
  }));

  it('should do something', function () {
    expect(!!bloc).toBe(true);
  });

});
