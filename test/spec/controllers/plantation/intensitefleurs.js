'use strict';

describe('Controller: PlantationIntensitefleursCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PlantationIntensitefleursCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlantationIntensitefleursCtrl = $controller('PlantationIntensitefleursCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PlantationIntensitefleursCtrl.awesomeThings.length).toBe(3);
  });
});
