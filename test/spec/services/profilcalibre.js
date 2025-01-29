'use strict';

describe('Service: ProfilCalibre', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var ProfilCalibre;
  beforeEach(inject(function (_ProfilCalibre_) {
    ProfilCalibre = _ProfilCalibre_;
  }));

  it('should do something', function () {
    expect(!!ProfilCalibre).toBe(true);
  });

});
