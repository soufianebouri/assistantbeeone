'use strict';

describe('Controller: SanteplanteRealisationtraitementphytosanitaireCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SanteplanteRealisationtraitementphytosanitaireCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanteplanteRealisationtraitementphytosanitaireCtrl = $controller('SanteplanteRealisationtraitementphytosanitaireCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SanteplanteRealisationtraitementphytosanitaireCtrl.awesomeThings.length).toBe(3);
  });
});
