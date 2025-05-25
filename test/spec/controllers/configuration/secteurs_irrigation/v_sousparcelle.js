'use strict';

describe('Controller: ConfigurationSecteursIrrigationVSousparcelleCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ConfigurationSecteursIrrigationVSousparcelleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationSecteursIrrigationVSousparcelleCtrl = $controller('ConfigurationSecteursIrrigationVSousparcelleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigurationSecteursIrrigationVSousparcelleCtrl.awesomeThings.length).toBe(3);
  });
});
