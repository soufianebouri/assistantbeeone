'use strict';

describe('Controller: RepositoryTrancheAgeCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryTrancheAgeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryTrancheAgeCtrl = $controller('RepositoryTrancheAgeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryTrancheAgeCtrl.awesomeThings.length).toBe(3);
  });
});
