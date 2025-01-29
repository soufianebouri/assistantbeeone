'use strict';

describe('Service: AgreageFruit', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var AgreageFruit;
  beforeEach(inject(function (_AgreageFruit_) {
    AgreageFruit = _AgreageFruit_;
  }));

  it('should do something', function () {
    expect(!!AgreageFruit).toBe(true);
  });

});
