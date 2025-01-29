'use strict';

describe('Controller: GrandesculturesSuividesstadesgcCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var GrandesculturesSuividesstadesgcCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GrandesculturesSuividesstadesgcCtrl = $controller('GrandesculturesSuividesstadesgcCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(GrandesculturesSuividesstadesgcCtrl.awesomeThings.length).toBe(3);
  });
});
