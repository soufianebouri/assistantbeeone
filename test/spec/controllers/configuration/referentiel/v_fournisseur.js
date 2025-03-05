'use strict';

describe('Controller: ConfigurationReferentielVFournisseurCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ConfigurationReferentielVFournisseurCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationReferentielVFournisseurCtrl = $controller('ConfigurationReferentielVFournisseurCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigurationReferentielVFournisseurCtrl.awesomeThings.length).toBe(3);
  });
});
