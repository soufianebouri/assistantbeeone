'use strict';

describe('Controller: RepositoryFamillecultureCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryFamillecultureCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryFamillecultureCtrl = $controller('RepositoryFamillecultureCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryFamillecultureCtrl.awesomeThings.length).toBe(3);
  });
});
