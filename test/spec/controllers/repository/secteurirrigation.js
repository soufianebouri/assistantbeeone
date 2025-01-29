'use strict';

describe('Controller: RepositorySecteurirrigationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RepositorySecteurirrigationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepositorySecteurirrigationCtrl = $controller('RepositorySecteurirrigationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RepositorySecteurirrigationCtrl.awesomeThings.length).toBe(3);
  });
});
