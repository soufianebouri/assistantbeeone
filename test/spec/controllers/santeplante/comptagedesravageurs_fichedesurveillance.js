'use strict';

describe('Controller: SanteplanteComptagedesravageursFichedesurveillanceCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SanteplanteComptagedesravageursFichedesurveillanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanteplanteComptagedesravageursFichedesurveillanceCtrl = $controller('SanteplanteComptagedesravageursFichedesurveillanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SanteplanteComptagedesravageursFichedesurveillanceCtrl.awesomeThings.length).toBe(3);
  });
});
