'use strict';

describe('Controller: SanteplanteComptagedesravageursCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SanteplanteComptagedesravageursCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanteplanteComptagedesravageursCtrl = $controller('SanteplanteComptagedesravageursCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SanteplanteComptagedesravageursCtrl.awesomeThings.length).toBe(3);
  });
});
