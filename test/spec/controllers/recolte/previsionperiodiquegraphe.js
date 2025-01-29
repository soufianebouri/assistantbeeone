'use strict';

describe('Controller: RecoltePrevisionperiodiquegrapheCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecoltePrevisionperiodiquegrapheCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecoltePrevisionperiodiquegrapheCtrl = $controller('RecoltePrevisionperiodiquegrapheCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecoltePrevisionperiodiquegrapheCtrl.awesomeThings.length).toBe(3);
  });
});
