'use strict';

describe('Controller: RepositoryElementsminerauxCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryElementsminerauxCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryElementsminerauxCtrl = $controller('RepositoryElementsminerauxCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryElementsminerauxCtrl.awesomeThings.length).toBe(3);
  });
});
