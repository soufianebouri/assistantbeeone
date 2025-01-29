'use strict';

describe('Controller: RepositoryTypevarieteCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryTypevarieteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryTypevarieteCtrl = $controller('RepositoryTypevarieteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryTypevarieteCtrl.awesomeThings.length).toBe(3);
  });
});
