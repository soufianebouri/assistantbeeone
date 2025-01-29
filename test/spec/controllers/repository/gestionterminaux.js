'use strict';

describe('Controller: RepositoryGestionterminauxCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryGestionterminauxCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryGestionterminauxCtrl = $controller('RepositoryGestionterminauxCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryGestionterminauxCtrl.awesomeThings.length).toBe(3);
  });
});
