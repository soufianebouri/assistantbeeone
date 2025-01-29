'use strict';

describe('Controller: ManagerTbmanagerCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var ManagerTbmanagerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ManagerTbmanagerCtrl = $controller('ManagerTbmanagerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ManagerTbmanagerCtrl.awesomeThings.length).toBe(3);
  });
});
