'use strict';

describe('Controller: PalmierdattierComptagearbresyntheseCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierComptagearbresyntheseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierComptagearbresyntheseCtrl = $controller('PalmierdattierComptagearbresyntheseCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierComptagearbresyntheseCtrl.awesomeThings.length).toBe(3);
  });
});
