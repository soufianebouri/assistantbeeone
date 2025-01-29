'use strict';

describe('Controller: RecoltePrevisiontodayCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecoltePrevisiontodayCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecoltePrevisiontodayCtrl = $controller('RecoltePrevisiontodayCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecoltePrevisiontodayCtrl.awesomeThings.length).toBe(3);
  });
});
