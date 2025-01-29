'use strict';

describe('Controller: TbrendementCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var TbrendementCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TbrendementCtrl = $controller('TbrendementCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(TbrendementCtrl.awesomeThings.length).toBe(3);
  });
});
