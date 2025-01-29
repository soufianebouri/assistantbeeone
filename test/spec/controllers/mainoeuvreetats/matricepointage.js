'use strict';

describe('Controller: MainoeuvreetatsMatricepointageCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var MainoeuvreetatsMatricepointageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainoeuvreetatsMatricepointageCtrl = $controller('MainoeuvreetatsMatricepointageCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MainoeuvreetatsMatricepointageCtrl.awesomeThings.length).toBe(3);
  });
});
