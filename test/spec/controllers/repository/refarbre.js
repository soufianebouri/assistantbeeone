'use strict';

describe('Controller: RepositoryRefarbreCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryRefarbreCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryRefarbreCtrl = $controller('RepositoryRefarbreCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryRefarbreCtrl.awesomeThings.length).toBe(3);
  });
});
