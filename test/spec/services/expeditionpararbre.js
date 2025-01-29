'use strict';

describe('Service: expeditionpararbre', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var expeditionpararbre;
  beforeEach(inject(function (_expeditionpararbre_) {
    expeditionpararbre = _expeditionpararbre_;
  }));

  it('should do something', function () {
    expect(!!expeditionpararbre).toBe(true);
  });

});
