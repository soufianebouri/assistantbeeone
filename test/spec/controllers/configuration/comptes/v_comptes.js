'use strict';

describe('Controller: ConfigurationComptesVComptesCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ConfigurationComptesVComptesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationComptesVComptesCtrl = $controller('ConfigurationComptesVComptesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigurationComptesVComptesCtrl.awesomeThings.length).toBe(3);
  });
});
