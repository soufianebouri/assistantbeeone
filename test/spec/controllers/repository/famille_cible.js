'use strict';

describe('Controller: RepositoryFamilleCibleCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryFamilleCibleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryFamilleCibleCtrl = $controller('RepositoryFamilleCibleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryFamilleCibleCtrl.awesomeThings.length).toBe(3);
  });
});
