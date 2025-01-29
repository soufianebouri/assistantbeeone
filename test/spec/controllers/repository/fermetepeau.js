'use strict';

describe('Controller: RepositoryFermetepeauCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryFermetepeauCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryFermetepeauCtrl = $controller('RepositoryFermetepeauCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryFermetepeauCtrl.awesomeThings.length).toBe(3);
  });
});
