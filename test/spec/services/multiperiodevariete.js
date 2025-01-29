'use strict';

describe('Service: multiperiodevariete', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var multiperiodevariete;
  beforeEach(inject(function (_multiperiodevariete_) {
    multiperiodevariete = _multiperiodevariete_;
  }));

  it('should do something', function () {
    expect(!!multiperiodevariete).toBe(true);
  });

});
