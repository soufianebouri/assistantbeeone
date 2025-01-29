'use strict';

describe('Controller: RecolteAgreagefruitoldCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteAgreagefruitoldCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteAgreagefruitoldCtrl = $controller('RecolteAgreagefruitoldCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteAgreagefruitoldCtrl.awesomeThings.length).toBe(3);
  });
});
