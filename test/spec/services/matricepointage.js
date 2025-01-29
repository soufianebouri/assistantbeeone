'use strict';

describe('Service: matricepointage', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var matricepointage;
  beforeEach(inject(function (_matricepointage_) {
    matricepointage = _matricepointage_;
  }));

  it('should do something', function () {
    expect(!!matricepointage).toBe(true);
  });

});
