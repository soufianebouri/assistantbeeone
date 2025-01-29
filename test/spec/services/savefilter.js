'use strict';

describe('Service: savefilter', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var savefilter;
  beforeEach(inject(function (_savefilter_) {
    savefilter = _savefilter_;
  }));

  it('should do something', function () {
    expect(!!savefilter).toBe(true);
  });

});
