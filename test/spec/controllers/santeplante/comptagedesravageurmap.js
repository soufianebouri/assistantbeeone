'use strict';

describe('Controller: SanteplanteComptagedesravageurmapCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SanteplanteComptagedesravageurmapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanteplanteComptagedesravageurmapCtrl = $controller('SanteplanteComptagedesravageurmapCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SanteplanteComptagedesravageurmapCtrl.awesomeThings.length).toBe(3);
  });
});
