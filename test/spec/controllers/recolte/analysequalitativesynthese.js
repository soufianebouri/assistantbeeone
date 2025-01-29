'use strict';

describe('Controller: RecolteAnalysequalitativesyntheseCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteAnalysequalitativesyntheseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteAnalysequalitativesyntheseCtrl = $controller('RecolteAnalysequalitativesyntheseCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteAnalysequalitativesyntheseCtrl.awesomeThings.length).toBe(3);
  });
});
