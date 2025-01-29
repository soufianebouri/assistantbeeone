'use strict';

describe('Controller: RepositoryCategoriepesticideCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryCategoriepesticideCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryCategoriepesticideCtrl = $controller('RepositoryCategoriepesticideCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryCategoriepesticideCtrl.awesomeThings.length).toBe(3);
  });
});
