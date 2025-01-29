'use strict';

describe('Controller: PrevisionreportingMultiperiodevarieteCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PrevisionreportingMultiperiodevarieteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PrevisionreportingMultiperiodevarieteCtrl = $controller('PrevisionreportingMultiperiodevarieteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PrevisionreportingMultiperiodevarieteCtrl.awesomeThings.length).toBe(3);
  });
});
