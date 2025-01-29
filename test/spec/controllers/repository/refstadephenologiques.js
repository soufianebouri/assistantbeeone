'use strict';

describe('Controller: RepositoryRefstadephenologiquesCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryRefstadephenologiquesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryRefstadephenologiquesCtrl = $controller('RepositoryRefstadephenologiquesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryRefstadephenologiquesCtrl.awesomeThings.length).toBe(3);
  });
});
