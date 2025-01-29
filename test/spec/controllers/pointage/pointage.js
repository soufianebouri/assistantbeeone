'use strict';

describe('Controller: PointagePointageCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PointagePointageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PointagePointageCtrl = $controller('PointagePointageCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PointagePointageCtrl.awesomeThings.length).toBe(3);
  });
});
