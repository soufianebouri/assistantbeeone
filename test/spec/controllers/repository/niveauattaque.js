'use strict';

describe('Controller: RepositoryNiveauattaqueCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryNiveauattaqueCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryNiveauattaqueCtrl = $controller('RepositoryNiveauattaqueCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryNiveauattaqueCtrl.awesomeThings.length).toBe(3);
  });
});
