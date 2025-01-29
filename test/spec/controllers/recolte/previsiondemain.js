'use strict';

describe('Controller: RecoltePrevisiondemainCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecoltePrevisiondemainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecoltePrevisiondemainCtrl = $controller('RecoltePrevisiondemainCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecoltePrevisiondemainCtrl.awesomeThings.length).toBe(3);
  });
});
