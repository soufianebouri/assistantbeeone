'use strict';

describe('Controller: RecolteExpeditionsCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteExpeditionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteExpeditionsCtrl = $controller('RecolteExpeditionsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteExpeditionsCtrl.awesomeThings.length).toBe(3);
  });
});
