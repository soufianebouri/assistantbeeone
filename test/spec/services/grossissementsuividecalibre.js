'use strict';

describe('Service: grossissementsuividecalibre', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var grossissementsuividecalibre;
  beforeEach(inject(function (_grossissementsuividecalibre_) {
    grossissementsuividecalibre = _grossissementsuividecalibre_;
  }));

  it('should do something', function () {
    expect(!!grossissementsuividecalibre).toBe(true);
  });

});
