'use strict';

describe('Service: RamassageDestruction', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var RamassageDestruction;
  beforeEach(inject(function (_RamassageDestruction_) {
    RamassageDestruction = _RamassageDestruction_;
  }));

  it('should do something', function () {
    expect(!!RamassageDestruction).toBe(true);
  });

});
