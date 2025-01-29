'use strict';

describe('Controller: MainoeuvreetatsCoutparoperationsCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var MainoeuvreetatsCoutparoperationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainoeuvreetatsCoutparoperationsCtrl = $controller('MainoeuvreetatsCoutparoperationsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MainoeuvreetatsCoutparoperationsCtrl.awesomeThings.length).toBe(3);
  });
});
