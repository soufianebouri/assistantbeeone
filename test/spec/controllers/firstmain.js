'use strict';

describe('Controller: FirstmainCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var FirstmainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FirstmainCtrl = $controller('FirstmainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FirstmainCtrl.awesomeThings.length).toBe(3);
  });
});
