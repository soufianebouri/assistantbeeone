'use strict';

describe('Controller: ConfigurationReferentielVProduitRendementCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ConfigurationReferentielVProduitRendementCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationReferentielVProduitRendementCtrl = $controller('ConfigurationReferentielVProduitRendementCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigurationReferentielVProduitRendementCtrl.awesomeThings.length).toBe(3);
  });
});
