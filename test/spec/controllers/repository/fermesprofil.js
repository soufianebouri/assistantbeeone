'use strict';

describe('Controller: RepositoryFermesprofilCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryFermesprofilCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryFermesprofilCtrl = $controller('RepositoryFermesprofilCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryFermesprofilCtrl.awesomeThings.length).toBe(3);
  });
});
