'use strict';

describe('Controller: SanteplanteChangementpheromoneCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var SanteplanteChangementpheromoneCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanteplanteChangementpheromoneCtrl = $controller('SanteplanteChangementpheromoneCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SanteplanteChangementpheromoneCtrl.awesomeThings.length).toBe(3);
  });
});
