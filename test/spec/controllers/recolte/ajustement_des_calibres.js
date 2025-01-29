'use strict';

describe('Controller: RecolteAjustementDesCalibresCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteAjustementDesCalibresCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteAjustementDesCalibresCtrl = $controller('RecolteAjustementDesCalibresCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteAjustementDesCalibresCtrl.awesomeThings.length).toBe(3);
  });
});
