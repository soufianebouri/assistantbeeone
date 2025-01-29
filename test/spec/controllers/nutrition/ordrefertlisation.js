'use strict';

describe('Controller: NutritionOrdrefertlisationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var NutritionOrdrefertlisationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NutritionOrdrefertlisationCtrl = $controller('NutritionOrdrefertlisationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NutritionOrdrefertlisationCtrl.awesomeThings.length).toBe(3);
  });
});
