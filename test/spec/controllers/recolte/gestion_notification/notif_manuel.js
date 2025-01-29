'use strict';

describe('Controller: RecolteGestionNotificationNotifManuelCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteGestionNotificationNotifManuelCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteGestionNotificationNotifManuelCtrl = $controller('RecolteGestionNotificationNotifManuelCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteGestionNotificationNotifManuelCtrl.awesomeThings.length).toBe(3);
  });
});
