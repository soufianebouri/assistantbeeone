'use strict';

describe('Controller: RecolteProductionRealiseeCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteProductionRealiseeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteProductionRealiseeCtrl = $controller('RecolteProductionRealiseeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteProductionRealiseeCtrl.awesomeThings.length).toBe(3);
  });
});
