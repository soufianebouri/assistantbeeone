'use strict';

describe('Controller: PlantationStadehenologiquesdiagrammeganttCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PlantationStadehenologiquesdiagrammeganttCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlantationStadehenologiquesdiagrammeganttCtrl = $controller('PlantationStadehenologiquesdiagrammeganttCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PlantationStadehenologiquesdiagrammeganttCtrl.awesomeThings.length).toBe(3);
  });
});
