'use strict';

describe('Controller: NutritionControlephecChartCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var NutritionControlephecChartCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NutritionControlephecChartCtrl = $controller('NutritionControlephecChartCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NutritionControlephecChartCtrl.awesomeThings.length).toBe(3);
  });
});
