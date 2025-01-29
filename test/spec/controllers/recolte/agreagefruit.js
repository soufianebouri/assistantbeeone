'use strict';

describe('Controller: RecolteAgreagefruitCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteAgreagefruitCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteAgreagefruitCtrl = $controller('RecolteAgreagefruitCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteAgreagefruitCtrl.awesomeThings.length).toBe(3);
  });
});
