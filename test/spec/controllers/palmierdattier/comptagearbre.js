'use strict';

describe('Controller: PalmierdattierComptagearbreCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierComptagearbreCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierComptagearbreCtrl = $controller('PalmierdattierComptagearbreCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierComptagearbreCtrl.awesomeThings.length).toBe(3);
  });
});
