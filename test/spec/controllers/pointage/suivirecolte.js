'use strict';

describe('Controller: PointageSuivirecolteCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PointageSuivirecolteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PointageSuivirecolteCtrl = $controller('PointageSuivirecolteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PointageSuivirecolteCtrl.awesomeThings.length).toBe(3);
  });
});
