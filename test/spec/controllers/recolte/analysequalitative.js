'use strict';

describe('Controller: RecolteAnalysequalitativeCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteAnalysequalitativeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteAnalysequalitativeCtrl = $controller('RecolteAnalysequalitativeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteAnalysequalitativeCtrl.awesomeThings.length).toBe(3);
  });
});
