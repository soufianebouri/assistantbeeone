'use strict';

describe('Controller: RepositoryQualiteStadeCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryQualiteStadeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryQualiteStadeCtrl = $controller('RepositoryQualiteStadeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryQualiteStadeCtrl.awesomeThings.length).toBe(3);
  });
});
