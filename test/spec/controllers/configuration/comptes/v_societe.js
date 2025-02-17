'use strict';

describe('Controller: ConfigurationComptesVSocieteCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ConfigurationComptesVSocieteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationComptesVSocieteCtrl = $controller('ConfigurationComptesVSocieteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigurationComptesVSocieteCtrl.awesomeThings.length).toBe(3);
  });
});
