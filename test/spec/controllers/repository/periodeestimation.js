'use strict';

describe('Controller: RepositoryPeriodeestimationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryPeriodeestimationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryPeriodeestimationCtrl = $controller('RepositoryPeriodeestimationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryPeriodeestimationCtrl.awesomeThings.length).toBe(3);
  });
});
