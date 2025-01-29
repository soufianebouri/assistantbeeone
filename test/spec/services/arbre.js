'use strict';

describe('Service: Arbre', function () {

  // load the service's module
  beforeEach(module('beeOneWebFrontApp'));

  // instantiate service
  var Arbre;
  beforeEach(inject(function (_Arbre_) {
    Arbre = _Arbre_;
  }));

  it('should do something', function () {
    expect(!!Arbre).toBe(true);
  });

});
