'use strict';

describe('Service: refstadephenologiques', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var refstadephenologiques;
  beforeEach(inject(function (_refstadephenologiques_) {
    refstadephenologiques = _refstadephenologiques_;
  }));

  it('should do something', function () {
    expect(!!refstadephenologiques).toBe(true);
  });

});
