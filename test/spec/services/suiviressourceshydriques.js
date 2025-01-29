'use strict';

describe('Service: suiviressourceshydriques', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var suiviressourceshydriques;
  beforeEach(inject(function (_suiviressourceshydriques_) {
    suiviressourceshydriques = _suiviressourceshydriques_;
  }));

  it('should do something', function () {
    expect(!!suiviressourceshydriques).toBe(true);
  });

});
