'use strict';

describe('Controller: SanteplanteFichesdesuividechangementpheromoneCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SanteplanteFichesdesuividechangementpheromoneCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanteplanteFichesdesuividechangementpheromoneCtrl = $controller('SanteplanteFichesdesuividechangementpheromoneCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SanteplanteFichesdesuividechangementpheromoneCtrl.awesomeThings.length).toBe(3);
  });
});
