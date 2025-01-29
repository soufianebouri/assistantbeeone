'use strict';

describe('Service: elementcomptage', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var elementcomptage;
  beforeEach(inject(function (_elementcomptage_) {
    elementcomptage = _elementcomptage_;
  }));

  it('should do something', function () {
    expect(!!elementcomptage).toBe(true);
  });

});
