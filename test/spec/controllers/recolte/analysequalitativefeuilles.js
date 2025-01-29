'use strict';

describe('Controller: RecolteAnalysequalitativefeuillesCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteAnalysequalitativefeuillesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteAnalysequalitativefeuillesCtrl = $controller('RecolteAnalysequalitativefeuillesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteAnalysequalitativefeuillesCtrl.awesomeThings.length).toBe(3);
  });
});
