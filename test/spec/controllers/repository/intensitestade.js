'use strict';

describe('Controller: RepositoryIntensitestadeCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryIntensitestadeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryIntensitestadeCtrl = $controller('RepositoryIntensitestadeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryIntensitestadeCtrl.awesomeThings.length).toBe(3);
  });
});
