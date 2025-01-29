'use strict';

describe('Controller: OperationsclesRecoltepollenmapCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var OperationsclesRecoltepollenmapCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OperationsclesRecoltepollenmapCtrl = $controller('OperationsclesRecoltepollenmapCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OperationsclesRecoltepollenmapCtrl.awesomeThings.length).toBe(3);
  });
});
