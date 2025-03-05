'use strict';

describe('Controller: ConfigurationReferentielVProfileProductionCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ConfigurationReferentielVProfileProductionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationReferentielVProfileProductionCtrl = $controller('ConfigurationReferentielVProfileProductionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigurationReferentielVProfileProductionCtrl.awesomeThings.length).toBe(3);
  });
});
