'use strict';

describe('Controller: ConfigurationSecteursIrrigationVBlocCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ConfigurationSecteursIrrigationVBlocCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConfigurationSecteursIrrigationVBlocCtrl = $controller('ConfigurationSecteursIrrigationVBlocCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ConfigurationSecteursIrrigationVBlocCtrl.awesomeThings.length).toBe(3);
  });
});
