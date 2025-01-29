'use strict';

describe('Service: comptagedespiegesmap', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var comptagedespiegesmap;
  beforeEach(inject(function (_comptagedespiegesmap_) {
    comptagedespiegesmap = _comptagedespiegesmap_;
  }));

  it('should do something', function () {
    expect(!!comptagedespiegesmap).toBe(true);
  });

});
