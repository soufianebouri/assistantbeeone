'use strict';

describe('Controller: RepositoryParametretechniqueCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryParametretechniqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryParametretechniqueCtrl = $controller('RepositoryParametretechniqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryParametretechniqueCtrl.awesomeThings.length).toBe(3);
  });
});
