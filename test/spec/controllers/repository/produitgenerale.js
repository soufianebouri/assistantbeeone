'use strict';

describe('Controller: RepositoryProduitgeneraleCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryProduitgeneraleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryProduitgeneraleCtrl = $controller('RepositoryProduitgeneraleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryProduitgeneraleCtrl.awesomeThings.length).toBe(3);
  });
});
