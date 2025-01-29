'use strict';

describe('Controller: RecolteAnalysequalitativesimplifiedCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteAnalysequalitativesimplifiedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteAnalysequalitativesimplifiedCtrl = $controller('RecolteAnalysequalitativesimplifiedCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteAnalysequalitativesimplifiedCtrl.awesomeThings.length).toBe(3);
  });
});
