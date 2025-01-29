'use strict';

describe('Controller: SanteplanteOrdretraitementphytosanitaireCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SanteplanteOrdretraitementphytosanitaireCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanteplanteOrdretraitementphytosanitaireCtrl = $controller('SanteplanteOrdretraitementphytosanitaireCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SanteplanteOrdretraitementphytosanitaireCtrl.awesomeThings.length).toBe(3);
  });
});
