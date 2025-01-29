'use strict';

describe('Service: tbTechnique.js', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var tbTechnique.js;
  beforeEach(inject(function (_tbTechnique.js_) {
    tbTechnique.js = _tbTechnique.js_;
  }));

  it('should do something', function () {
    expect(!!tbTechnique.js).toBe(true);
  });

});
