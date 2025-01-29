'use strict';

describe('Controller: RepositoryValidationautoobsCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryValidationautoobsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryValidationautoobsCtrl = $controller('RepositoryValidationautoobsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryValidationautoobsCtrl.awesomeThings.length).toBe(3);
  });
});
