'use strict';

describe('Controller: MainoeuvreetatsBordereaucnssCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var MainoeuvreetatsBordereaucnssCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainoeuvreetatsBordereaucnssCtrl = $controller('MainoeuvreetatsBordereaucnssCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MainoeuvreetatsBordereaucnssCtrl.awesomeThings.length).toBe(3);
  });
});
