'use strict';

describe('Controller: RepositoryLieueliminationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryLieueliminationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryLieueliminationCtrl = $controller('RepositoryLieueliminationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryLieueliminationCtrl.awesomeThings.length).toBe(3);
  });
});
