'use strict';

describe('Controller: ApporteauBilanNutritionnelCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ApporteauBilanNutritionnelCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApporteauBilanNutritionnelCtrl = $controller('ApporteauBilanNutritionnelCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ApporteauBilanNutritionnelCtrl.awesomeThings.length).toBe(3);
  });
});
