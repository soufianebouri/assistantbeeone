'use strict';

describe('Controller: RecolteAnalysequalitativesimplifiedchartCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteAnalysequalitativesimplifiedchartCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteAnalysequalitativesimplifiedchartCtrl = $controller('RecolteAnalysequalitativesimplifiedchartCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteAnalysequalitativesimplifiedchartCtrl.awesomeThings.length).toBe(3);
  });
});
