'use strict';

describe('Controller: RepositoryRessourcesHydriquesCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositoryRessourcesHydriquesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositoryRessourcesHydriquesCtrl = $controller('RepositoryRessourcesHydriquesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositoryRessourcesHydriquesCtrl.awesomeThings.length).toBe(3);
  });
});
