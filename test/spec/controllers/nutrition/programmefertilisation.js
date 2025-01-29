'use strict';

describe('Controller: NutritionProgrammefertilisationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var NutritionProgrammefertilisationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NutritionProgrammefertilisationCtrl = $controller('NutritionProgrammefertilisationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NutritionProgrammefertilisationCtrl.awesomeThings.length).toBe(3);
  });
});
