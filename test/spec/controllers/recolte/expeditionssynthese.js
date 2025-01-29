'use strict';

describe('Controller: RecolteExpeditionssyntheseCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var RecolteExpeditionssyntheseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecolteExpeditionssyntheseCtrl = $controller('RecolteExpeditionssyntheseCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecolteExpeditionssyntheseCtrl.awesomeThings.length).toBe(3);
  });
});
