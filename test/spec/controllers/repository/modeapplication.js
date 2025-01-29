'use strict';

describe('Controller: RepositoryModeapplicationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryModeapplicationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryModeapplicationCtrl = $controller('RepositoryModeapplicationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryModeapplicationCtrl.awesomeThings.length).toBe(3);
  });
});
