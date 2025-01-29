'use strict';

describe('Controller: RepositoryFamilleoperationsCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryFamilleoperationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryFamilleoperationsCtrl = $controller('RepositoryFamilleoperationsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryFamilleoperationsCtrl.awesomeThings.length).toBe(3);
  });
});
