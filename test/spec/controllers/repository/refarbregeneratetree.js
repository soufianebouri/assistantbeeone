'use strict';

describe('Controller: RepositoryRefarbregeneratetreeCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryRefarbregeneratetreeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryRefarbregeneratetreeCtrl = $controller('RepositoryRefarbregeneratetreeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryRefarbregeneratetreeCtrl.awesomeThings.length).toBe(3);
  });
});
