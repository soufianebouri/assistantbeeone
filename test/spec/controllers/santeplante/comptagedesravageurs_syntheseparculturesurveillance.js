'use strict';

describe('Controller: SanteplanteComptagedesravageursSyntheseparculturesurveillanceCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SanteplanteComptagedesravageursSyntheseparculturesurveillanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanteplanteComptagedesravageursSyntheseparculturesurveillanceCtrl = $controller('SanteplanteComptagedesravageursSyntheseparculturesurveillanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SanteplanteComptagedesravageursSyntheseparculturesurveillanceCtrl.awesomeThings.length).toBe(3);
  });
});
