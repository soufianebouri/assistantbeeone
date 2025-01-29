'use strict';

describe('Controller: SanteplanteRamassagedestructionCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SanteplanteRamassagedestructionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanteplanteRamassagedestructionCtrl = $controller('SanteplanteRamassagedestructionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SanteplanteRamassagedestructionCtrl.awesomeThings.length).toBe(3);
  });
});
