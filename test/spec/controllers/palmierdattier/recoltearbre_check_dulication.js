'use strict';

describe('Controller: PalmierdattierRecoltearbreCheckDulicationCtrl', function () {

  // load the controller's module
  beforeEach(module('beeOneWebFrontApp'));

  var PalmierdattierRecoltearbreCheckDulicationCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PalmierdattierRecoltearbreCheckDulicationCtrl = $controller('PalmierdattierRecoltearbreCheckDulicationCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PalmierdattierRecoltearbreCheckDulicationCtrl.awesomeThings.length).toBe(3);
  });
});
