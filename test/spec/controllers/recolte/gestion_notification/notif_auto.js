'use strict';

describe('Controller: RecolteGestionNotificationNotifAutoCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteGestionNotificationNotifAutoCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteGestionNotificationNotifAutoCtrl = $controller('RecolteGestionNotificationNotifAutoCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteGestionNotificationNotifAutoCtrl.awesomeThings.length).toBe(3);
  });
});
