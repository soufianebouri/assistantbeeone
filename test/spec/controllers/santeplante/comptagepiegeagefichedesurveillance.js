'use strict';

describe('Controller: SanteplanteComptagepiegeagefichedesurveillanceCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SanteplanteComptagepiegeagefichedesurveillanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanteplanteComptagepiegeagefichedesurveillanceCtrl = $controller('SanteplanteComptagepiegeagefichedesurveillanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SanteplanteComptagepiegeagefichedesurveillanceCtrl.awesomeThings.length).toBe(3);
  });
});
