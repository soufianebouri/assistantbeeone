'use strict';

describe('Service: tborganisationparcelisation', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var tborganisationparcelisation;
  beforeEach(inject(function (_tborganisationparcelisation_) {
    tborganisationparcelisation = _tborganisationparcelisation_;
  }));

  it('should do something', function () {
    expect(!!tborganisationparcelisation).toBe(true);
  });

});
