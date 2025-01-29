'use strict';

describe('Controller: RepositoryNiveauconformiteCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryNiveauconformiteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryNiveauconformiteCtrl = $controller('RepositoryNiveauconformiteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryNiveauconformiteCtrl.awesomeThings.length).toBe(3);
  });
});
