'use strict';

describe('Controller: ConfigurationComptesVCampagnesAgricolesCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ConfigurationComptesVCampagnesAgricolesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationComptesVCampagnesAgricolesCtrl = $controller('ConfigurationComptesVCampagnesAgricolesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigurationComptesVCampagnesAgricolesCtrl.awesomeThings.length).toBe(3);
  });
});
