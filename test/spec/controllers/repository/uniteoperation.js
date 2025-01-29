'use strict';

describe('Controller: RepositoryUniteoperationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryUniteoperationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryUniteoperationCtrl = $controller('RepositoryUniteoperationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryUniteoperationCtrl.awesomeThings.length).toBe(3);
  });
});
