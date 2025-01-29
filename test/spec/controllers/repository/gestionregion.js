'use strict';

describe('Controller: RepositoryGestionregionCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryGestionregionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryGestionregionCtrl = $controller('RepositoryGestionregionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryGestionregionCtrl.awesomeThings.length).toBe(3);
  });
});
