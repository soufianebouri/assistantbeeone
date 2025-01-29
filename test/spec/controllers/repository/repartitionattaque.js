'use strict';

describe('Controller: RepositoryRepartitionattaqueCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryRepartitionattaqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryRepartitionattaqueCtrl = $controller('RepositoryRepartitionattaqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryRepartitionattaqueCtrl.awesomeThings.length).toBe(3);
  });
});
