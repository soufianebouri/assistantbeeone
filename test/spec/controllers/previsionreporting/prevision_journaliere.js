'use strict';

describe('Controller: PrevisionreportingPrevisionJournaliereCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PrevisionreportingPrevisionJournaliereCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PrevisionreportingPrevisionJournaliereCtrl = $controller('PrevisionreportingPrevisionJournaliereCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PrevisionreportingPrevisionJournaliereCtrl.awesomeThings.length).toBe(3);
  });
});
