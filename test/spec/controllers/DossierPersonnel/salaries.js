'use strict';

describe('Controller: DossierpersonnelSalariesCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var DossierpersonnelSalariesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DossierpersonnelSalariesCtrl = $controller('DossierpersonnelSalariesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DossierpersonnelSalariesCtrl.awesomeThings.length).toBe(3);
  });
});
