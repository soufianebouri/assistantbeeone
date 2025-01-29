'use strict';

describe('Controller: SanteplanteComptagepiegeCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SanteplanteComptagepiegeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanteplanteComptagepiegeCtrl = $controller('SanteplanteComptagepiegeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SanteplanteComptagepiegeCtrl.awesomeThings.length).toBe(3);
  });
});
