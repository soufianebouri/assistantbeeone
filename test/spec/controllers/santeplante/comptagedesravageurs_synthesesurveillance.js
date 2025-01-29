'use strict';

describe('Controller: SanteplanteComptagedesravageursSynthesesurveillanceCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SanteplanteComptagedesravageursSynthesesurveillanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanteplanteComptagedesravageursSynthesesurveillanceCtrl = $controller('SanteplanteComptagedesravageursSynthesesurveillanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SanteplanteComptagedesravageursSynthesesurveillanceCtrl.awesomeThings.length).toBe(3);
  });
});
